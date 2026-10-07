from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

import models, schemas, crud
from database import get_db, engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Airbnb Clone REST API",
    description="Fullstack Airbnb clone API powering search, booking, wishlists, reviews, and host management.",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Current active user mock helper (supports switching between Guest and Host)
DEFAULT_GUEST_ID = 4 # Alex Johnson
DEFAULT_HOST_ID = 1  # Sarah Jenkins

@app.get("/")
def read_root():
    return {"message": "Airbnb Clone API is active", "version": "1.0.0", "docs": "/docs"}

# --- USER ENDPOINTS ---
@app.get("/api/users/me", response_model=schemas.UserResponse)
def get_current_user(role: str = "guest", db: Session = Depends(get_db)):
    user_id = DEFAULT_HOST_ID if role == "host" else DEFAULT_GUEST_ID
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        # Fallback to first user
        user = db.query(models.User).first()
    return user

# --- LISTINGS ENDPOINTS ---
@app.get("/api/listings", response_model=List[schemas.ListingResponse])
def search_listings(
    category: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    guests: Optional[int] = Query(None),
    bedrooms: Optional[int] = Query(None),
    property_type: Optional[str] = Query(None),
    check_in: Optional[str] = Query(None),
    check_out: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return crud.get_listings(
        db,
        category=category,
        city=city,
        min_price=min_price,
        max_price=max_price,
        guests=guests,
        bedrooms=bedrooms,
        property_type=property_type,
        check_in=check_in,
        check_out=check_out,
        skip=skip,
        limit=limit
    )

@app.get("/api/listings/{listing_id}", response_model=schemas.ListingResponse)
def get_listing_detail(listing_id: int, db: Session = Depends(get_db)):
    listing = crud.get_listing_by_id(db, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

@app.post("/api/listings", response_model=schemas.ListingResponse, status_code=status.HTTP_201_CREATED)
def create_new_listing(
    listing_data: schemas.ListingCreate,
    host_id: int = DEFAULT_HOST_ID,
    db: Session = Depends(get_db)
):
    return crud.create_listing(db, listing_data, host_id=host_id)

@app.put("/api/listings/{listing_id}", response_model=schemas.ListingResponse)
def update_existing_listing(
    listing_id: int,
    listing_data: schemas.ListingUpdate,
    host_id: int = DEFAULT_HOST_ID,
    db: Session = Depends(get_db)
):
    updated = crud.update_listing(db, listing_id, listing_data, host_id=host_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Listing not found or unauthorized")
    return updated

@app.delete("/api/listings/{listing_id}")
def remove_listing(
    listing_id: int,
    host_id: int = DEFAULT_HOST_ID,
    db: Session = Depends(get_db)
):
    deleted = crud.delete_listing(db, listing_id, host_id=host_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Listing not found or unauthorized")
    return {"message": "Listing deleted successfully"}

@app.get("/api/listings/{listing_id}/booked-dates")
def get_booked_dates(listing_id: int, db: Session = Depends(get_db)):
    dates = crud.get_listing_booked_dates(db, listing_id)
    return {"listing_id": listing_id, "booked_dates": dates}

@app.post("/api/listings/{listing_id}/check-dates", response_model=schemas.DateCheckResponse)
def verify_date_availability(
    listing_id: int,
    payload: schemas.DateCheckRequest,
    db: Session = Depends(get_db)
):
    available, msg, booked_dates = crud.check_date_availability(
        db, listing_id, payload.check_in, payload.check_out
    )
    return {
        "available": available,
        "message": msg,
        "booked_dates": booked_dates
    }

# --- BOOKING ENDPOINTS ---
@app.post("/api/bookings", response_model=schemas.BookingResponse, status_code=status.HTTP_201_CREATED)
def create_reservation(
    booking_data: schemas.BookingCreate,
    user_id: int = DEFAULT_GUEST_ID,
    db: Session = Depends(get_db)
):
    try:
        booking = crud.create_booking(db, booking_data, user_id=user_id)
        return booking
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/bookings/my-trips", response_model=List[schemas.BookingResponse])
def get_my_trips(user_id: int = DEFAULT_GUEST_ID, db: Session = Depends(get_db)):
    return crud.get_user_bookings(db, user_id=user_id)

@app.post("/api/bookings/{booking_id}/cancel")
def cancel_trip(booking_id: int, user_id: int = DEFAULT_GUEST_ID, db: Session = Depends(get_db)):
    success = crud.cancel_booking(db, booking_id, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": "Reservation cancelled successfully"}

# --- REVIEWS ENDPOINTS ---
@app.post("/api/listings/{listing_id}/reviews", response_model=schemas.ReviewResponse)
def post_review(
    listing_id: int,
    review_data: schemas.ReviewCreate,
    user_id: int = DEFAULT_GUEST_ID,
    db: Session = Depends(get_db)
):
    listing = crud.get_listing_by_id(db, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return crud.create_review(db, listing_id, user_id, review_data)

@app.get("/api/listings/{listing_id}/reviews", response_model=List[schemas.ReviewResponse])
def get_listing_reviews(listing_id: int, db: Session = Depends(get_db)):
    reviews = db.query(models.Review).filter(models.Review.listing_id == listing_id).all()
    return reviews

# --- WISHLIST ENDPOINTS ---
@app.get("/api/wishlists", response_model=List[schemas.WishlistResponse])
def get_wishlists(user_id: int = DEFAULT_GUEST_ID, db: Session = Depends(get_db)):
    return crud.get_user_wishlists(db, user_id=user_id)

@app.post("/api/wishlists/toggle/{listing_id}")
def toggle_favorite(listing_id: int, user_id: int = DEFAULT_GUEST_ID, db: Session = Depends(get_db)):
    is_added = crud.toggle_wishlist(db, user_id=user_id, listing_id=listing_id)
    return {"listing_id": listing_id, "is_favorite": is_added}

# --- HOST DASHBOARD ENDPOINTS ---
@app.get("/api/host/stats", response_model=schemas.HostStatsResponse)
def get_host_stats(host_id: int = DEFAULT_HOST_ID, db: Session = Depends(get_db)):
    return crud.get_host_dashboard_stats(db, host_id=host_id)

@app.get("/api/host/listings", response_model=List[schemas.ListingResponse])
def get_host_managed_listings(host_id: int = DEFAULT_HOST_ID, db: Session = Depends(get_db)):
    return crud.get_host_listings(db, host_id=host_id)

@app.get("/api/host/reservations", response_model=List[schemas.BookingResponse])
def get_host_reservations_list(host_id: int = DEFAULT_HOST_ID, db: Session = Depends(get_db)):
    return crud.get_host_reservations(db, host_id=host_id)

# --- AMENITIES ENDPOINT ---
@app.get("/api/amenities", response_model=List[schemas.AmenityResponse])
def get_all_amenities(db: Session = Depends(get_db)):
    return db.query(models.Amenity).all()
