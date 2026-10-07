from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from datetime import datetime, timedelta
import models, schemas

def parse_date(date_str: str) -> datetime:
    return datetime.strptime(date_str, "%Y-%m-%d")

def get_listings(
    db: Session,
    category: str = None,
    city: str = None,
    min_price: float = None,
    max_price: float = None,
    guests: int = None,
    bedrooms: int = None,
    property_type: str = None,
    check_in: str = None,
    check_out: str = None,
    skip: int = 0,
    limit: int = 100
):
    query = db.query(models.Listing)

    if category and category.lower() != "all":
        query = query.filter(models.Listing.category.ilike(f"%{category}%"))

    if city:
        query = query.filter(
            or_(
                models.Listing.city.ilike(f"%{city}%"),
                models.Listing.state.ilike(f"%{city}%"),
                models.Listing.country.ilike(f"%{city}%"),
                models.Listing.title.ilike(f"%{city}%")
            )
        )

    if min_price is not None:
        query = query.filter(models.Listing.price_per_night >= min_price)

    if max_price is not None:
        query = query.filter(models.Listing.price_per_night <= max_price)

    if guests is not None:
        query = query.filter(models.Listing.max_guests >= guests)

    if bedrooms is not None and bedrooms > 0:
        query = query.filter(models.Listing.bedrooms >= bedrooms)

    if property_type and property_type.lower() != "any":
        query = query.filter(models.Listing.property_type.ilike(f"%{property_type}%"))

    # Date range availability filter
    if check_in and check_out:
        # Exclude listings that have confirmed bookings overlapping with check_in..check_out
        overlapping_listings = db.query(models.Booking.listing_id).filter(
            models.Booking.status == "confirmed",
            or_(
                and_(models.Booking.check_in <= check_in, models.Booking.check_out > check_in),
                and_(models.Booking.check_in < check_out, models.Booking.check_out >= check_out),
                and_(models.Booking.check_in >= check_in, models.Booking.check_out <= check_out)
            )
        ).subquery()

        query = query.filter(models.Listing.id.notin_(overlapping_listings))

    return query.offset(skip).limit(limit).all()

def get_listing_by_id(db: Session, listing_id: int):
    return db.query(models.Listing).filter(models.Listing.id == listing_id).first()

def get_listing_booked_dates(db: Session, listing_id: int):
    bookings = db.query(models.Booking).filter(
        models.Booking.listing_id == listing_id,
        models.Booking.status == "confirmed"
    ).all()
    
    booked_dates = []
    for b in bookings:
        try:
            start = parse_date(b.check_in)
            end = parse_date(b.check_out)
            curr = start
            while curr < end:
                booked_dates.append(curr.strftime("%Y-%m-%d"))
                curr += timedelta(days=1)
        except Exception:
            pass
    return booked_dates

def check_date_availability(db: Session, listing_id: int, check_in: str, check_out: str):
    overlapping = db.query(models.Booking).filter(
        models.Booking.listing_id == listing_id,
        models.Booking.status == "confirmed",
        or_(
            and_(models.Booking.check_in <= check_in, models.Booking.check_out > check_in),
            and_(models.Booking.check_in < check_out, models.Booking.check_out >= check_out),
            and_(models.Booking.check_in >= check_in, models.Booking.check_out <= check_out)
        )
    ).first()

    if overlapping:
        return False, f"Dates from {check_in} to {check_out} are already booked for this property.", get_listing_booked_dates(db, listing_id)
    
    return True, "Dates are available!", get_listing_booked_dates(db, listing_id)

def create_booking(db: Session, booking_data: schemas.BookingCreate, user_id: int):
    available, msg, _ = check_date_availability(
        db, booking_data.listing_id, booking_data.check_in, booking_data.check_out
    )
    if not available:
        raise ValueError(msg)

    listing = get_listing_by_id(db, booking_data.listing_id)
    if not listing:
        raise ValueError("Listing not found")

    d1 = parse_date(booking_data.check_in)
    d2 = parse_date(booking_data.check_out)
    nights = max(1, (d2 - d1).days)

    nightly_total = listing.price_per_night * nights
    total = nightly_total + listing.cleaning_fee + listing.service_fee

    db_booking = models.Booking(
        listing_id=booking_data.listing_id,
        user_id=user_id,
        check_in=booking_data.check_in,
        check_out=booking_data.check_out,
        guests_count=booking_data.guests_count,
        adults=booking_data.adults,
        children=booking_data.children,
        infants=booking_data.infants,
        pets=booking_data.pets,
        nightly_price=listing.price_per_night,
        cleaning_fee=listing.cleaning_fee,
        service_fee=listing.service_fee,
        total_price=round(total, 2),
        status="confirmed",
        payment_method=booking_data.payment_method
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_user_bookings(db: Session, user_id: int):
    return db.query(models.Booking).filter(models.Booking.user_id == user_id).order_by(models.Booking.created_at.desc()).all()

def cancel_booking(db: Session, booking_id: int, user_id: int):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        return False
    booking.status = "cancelled"
    db.commit()
    return True

def create_listing(db: Session, listing_data: schemas.ListingCreate, host_id: int):
    db_listing = models.Listing(
        title=listing_data.title,
        description=listing_data.description,
        category=listing_data.category,
        property_type=listing_data.property_type,
        room_type=listing_data.room_type,
        address=listing_data.address,
        city=listing_data.city,
        state=listing_data.state,
        country=listing_data.country,
        zipcode=listing_data.zipcode,
        latitude=listing_data.latitude or 34.0522,
        longitude=listing_data.longitude or -118.2437,
        price_per_night=listing_data.price_per_night,
        cleaning_fee=listing_data.cleaning_fee,
        service_fee=listing_data.service_fee,
        max_guests=listing_data.max_guests,
        bedrooms=listing_data.bedrooms,
        beds=listing_data.beds,
        baths=listing_data.baths,
        host_id=host_id,
        rating=5.0,
        review_count=0
    )
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)

    # Photos
    for idx, url in enumerate(listing_data.photos):
        photo = models.ListingPhoto(
            listing_id=db_listing.id,
            url=url,
            is_cover=(idx == 0),
            order=idx
        )
        db.add(photo)

    # Amenities
    if listing_data.amenity_ids:
        amenities = db.query(models.Amenity).filter(models.Amenity.id.in_(listing_data.amenity_ids)).all()
        db_listing.amenities = amenities

    db.commit()
    db.refresh(db_listing)
    return db_listing

def update_listing(db: Session, listing_id: int, listing_data: schemas.ListingUpdate, host_id: int):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id, models.Listing.host_id == host_id).first()
    if not listing:
        return None

    update_dict = listing_data.model_dump(exclude_unset=True)

    if "photos" in update_dict:
        photos = update_dict.pop("photos")
        if photos is not None:
            db.query(models.ListingPhoto).filter(models.ListingPhoto.listing_id == listing.id).delete()
            for idx, url in enumerate(photos):
                db.add(models.ListingPhoto(listing_id=listing.id, url=url, is_cover=(idx == 0), order=idx))

    if "amenity_ids" in update_dict:
        amenity_ids = update_dict.pop("amenity_ids")
        if amenity_ids is not None:
            amenities = db.query(models.Amenity).filter(models.Amenity.id.in_(amenity_ids)).all()
            listing.amenities = amenities

    for key, value in update_dict.items():
        setattr(listing, key, value)

    db.commit()
    db.refresh(listing)
    return listing

def delete_listing(db: Session, listing_id: int, host_id: int):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id, models.Listing.host_id == host_id).first()
    if not listing:
        return False
    db.delete(listing)
    db.commit()
    return True

def create_review(db: Session, listing_id: int, user_id: int, review_data: schemas.ReviewCreate):
    db_review = models.Review(
        listing_id=listing_id,
        user_id=user_id,
        rating=review_data.rating,
        cleanliness=review_data.cleanliness,
        accuracy=review_data.accuracy,
        communication=review_data.communication,
        location=review_data.location,
        check_in_rating=review_data.check_in_rating,
        value_rating=review_data.value_rating,
        comment=review_data.comment
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)

    # Recalculate rating & review count for listing
    reviews = db.query(models.Review).filter(models.Review.listing_id == listing_id).all()
    avg_rating = sum([r.rating for r in reviews]) / len(reviews)
    listing = get_listing_by_id(db, listing_id)
    if listing:
        listing.rating = round(avg_rating, 2)
        listing.review_count = len(reviews)
        db.commit()

    return db_review

def toggle_wishlist(db: Session, user_id: int, listing_id: int):
    existing = db.query(models.Wishlist).filter(
        models.Wishlist.user_id == user_id,
        models.Wishlist.listing_id == listing_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return False # Removed
    else:
        wishlist = models.Wishlist(user_id=user_id, listing_id=listing_id)
        db.add(wishlist)
        db.commit()
        return True # Added

def get_user_wishlists(db: Session, user_id: int):
    return db.query(models.Wishlist).filter(models.Wishlist.user_id == user_id).all()

def get_host_listings(db: Session, host_id: int):
    return db.query(models.Listing).filter(models.Listing.host_id == host_id).all()

def get_host_dashboard_stats(db: Session, host_id: int):
    listings = get_host_listings(db, host_id)
    listing_ids = [l.id for l in listings]

    total_listings = len(listings)
    
    if not listing_ids:
        return schemas.HostStatsResponse(
            total_listings=0,
            total_reservations=0,
            total_earnings=0.0,
            average_rating=5.0
        )

    bookings = db.query(models.Booking).filter(
        models.Booking.listing_id.in_(listing_ids),
        models.Booking.status == "confirmed"
    ).all()

    total_reservations = len(bookings)
    total_earnings = sum([b.total_price for b in bookings])
    
    ratings = [l.rating for l in listings if l.review_count > 0]
    avg_rating = round(sum(ratings) / len(ratings), 2) if ratings else 5.0

    return schemas.HostStatsResponse(
        total_listings=total_listings,
        total_reservations=total_reservations,
        total_earnings=round(total_earnings, 2),
        average_rating=avg_rating
    )

def get_host_reservations(db: Session, host_id: int):
    listings = get_host_listings(db, host_id)
    listing_ids = [l.id for l in listings]
    if not listing_ids:
        return []
    return db.query(models.Booking).filter(models.Booking.listing_id.in_(listing_ids)).order_by(models.Booking.created_at.desc()).all()
