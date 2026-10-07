from database import engine, SessionLocal, Base
import models
from datetime import datetime, timedelta

def seed_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    print("Seeding Users...")
    # Users
    host1 = models.User(
        name="Sarah Jenkins",
        email="sarah.j@airbnb.com",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        is_host=True,
        superhost_status=True,
        joined_date="2018",
        response_rate=100,
        bio="Architect and interior designer living between Malibu and Aspen. Passionate about sustainable luxury design."
    )
    host2 = models.User(
        name="Michael Chen",
        email="michael.c@airbnb.com",
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        is_host=True,
        superhost_status=True,
        joined_date="2019",
        response_rate=98,
        bio="Real estate enthusiast and travel blogger. Loving sharing unique homes across California and Hawaii."
    )
    host3 = models.User(
        name="Elena Rostova",
        email="elena.r@airbnb.com",
        avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        is_host=True,
        superhost_status=False,
        joined_date="2021",
        response_rate=95,
        bio="Hospitality veteran managing unique boutique stays in Europe and South America."
    )
    guest1 = models.User(
        name="Alex Johnson",
        email="alex.j@gmail.com",
        avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        is_host=False,
        superhost_status=False,
        joined_date="2022",
        bio="Avid traveler, photographer, and coffee lover."
    )

    db.add_all([host1, host2, host3, guest1])
    db.commit()
    db.refresh(host1)
    db.refresh(host2)
    db.refresh(host3)
    db.refresh(guest1)

    print("Seeding Amenities...")
    # Amenities
    amenity_items = [
        ("Wifi", "wifi", "Basics"),
        ("Kitchen", "utensils", "Basics"),
        ("Free parking", "car", "Basics"),
        ("Air conditioning", "wind", "Basics"),
        ("Dedicated workspace", "laptop", "Basics"),
        ("Pool", "waves", "Features"),
        ("Hot tub", "flame", "Features"),
        ("Patio / Balcony", "sun", "Features"),
        ("Waterfront", "anchor", "Location"),
        ("Firepit", "fire", "Features"),
        ("EV charger", "zap", "Basics"),
        ("TV with Netflix", "tv", "Basics"),
        ("Washer & Dryer", "shirt", "Basics"),
        ("Self check-in", "key", "Safety"),
    ]
    
    amenities_db = []
    for name, icon, cat in amenity_items:
        a = models.Amenity(name=name, icon=icon, category=cat)
        db.add(a)
        amenities_db.append(a)
    db.commit()

    print("Seeding Listings...")
    listings_data = [
        {
            "title": "Malibu Sunset Oceanfront Glass Villa",
            "description": "Experience uncompromised luxury directly on the sands of Malibu. Features panoramic floor-to-ceiling glass walls, private beach access, a heated oceanfront infinity pool, and custom architectural finishes throughout.",
            "category": "Beachfront",
            "property_type": "Villa",
            "room_type": "Entire place",
            "address": "22400 Pacific Coast Highway",
            "city": "Malibu",
            "state": "California",
            "country": "United States",
            "price_per_night": 950.0,
            "cleaning_fee": 250.0,
            "service_fee": 120.0,
            "max_guests": 8,
            "bedrooms": 4,
            "beds": 4,
            "baths": 4.5,
            "rating": 4.98,
            "review_count": 42,
            "host": host1,
            "photos": [
                "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
            ]
        },
        {
            "title": "Aspen Luxury Alpine Log Chalet",
            "description": "Nestled in the heart of Aspen's mountains, this handcrafted timber chalet offers ski-in/ski-out convenience, a roaring stone fireplace, private outdoor cedar hot tub, and breathtaking alpine vistas.",
            "category": "Cabins",
            "property_type": "Chalet",
            "room_type": "Entire place",
            "address": "780 Mountain Shadow Dr",
            "city": "Aspen",
            "state": "Colorado",
            "country": "United States",
            "price_per_night": 780.0,
            "cleaning_fee": 200.0,
            "service_fee": 95.0,
            "max_guests": 10,
            "bedrooms": 5,
            "beds": 6,
            "baths": 5.0,
            "rating": 4.95,
            "review_count": 38,
            "host": host1,
            "photos": [
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80"
            ]
        },
        {
            "title": "Beverly Hills Modern Architectural Mansion",
            "description": "An iconic Hollywood Hills sanctuary featuring zero-edge infinity pool overlooking the entire LA basin, private theater room, chef's kitchen, smart home automation, and tennis court.",
            "category": "Mansions",
            "property_type": "Mansion",
            "room_type": "Entire place",
            "address": "1200 Summitridge Dr",
            "city": "Beverly Hills",
            "state": "California",
            "country": "United States",
            "price_per_night": 1850.0,
            "cleaning_fee": 400.0,
            "service_fee": 250.0,
            "max_guests": 12,
            "bedrooms": 6,
            "beds": 7,
            "baths": 7.0,
            "rating": 4.99,
            "review_count": 27,
            "host": host2,
            "photos": [
                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
            ]
        },
        {
            "title": "Geodesic Glass Stargazing Dome & Hot Tub",
            "description": "Sleep under the Milky Way in this climate-controlled geodesic glass dome in Joshua Tree. Comes with outdoor stargazing telescope, wood-burning cedar sauna, and campfire pit.",
            "category": "OMG!",
            "property_type": "Dome",
            "room_type": "Entire place",
            "address": "4500 Sunfair Rd",
            "city": "Joshua Tree",
            "state": "California",
            "country": "United States",
            "price_per_night": 390.0,
            "cleaning_fee": 85.0,
            "service_fee": 45.0,
            "max_guests": 2,
            "bedrooms": 1,
            "beds": 1,
            "baths": 1.0,
            "rating": 4.96,
            "review_count": 84,
            "host": host2,
            "photos": [
                "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80"
            ]
        },
        {
            "title": "Santorini Caldera Cliffside Infinity Pool Villa",
            "description": "Perched dramatically over the Aegean Sea in Oia, Santorini. Iconic white-washed dome architecture with private cliffside infinity pool and unhindered sunset views.",
            "category": "Amazing pools",
            "property_type": "Cave House",
            "room_type": "Entire place",
            "address": "Oia Cliffside Walkway",
            "city": "Santorini",
            "state": "Cyclades",
            "country": "Greece",
            "price_per_night": 1100.0,
            "cleaning_fee": 150.0,
            "service_fee": 140.0,
            "max_guests": 4,
            "bedrooms": 2,
            "beds": 2,
            "baths": 2.0,
            "rating": 4.99,
            "review_count": 65,
            "host": host3,
            "photos": [
                "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"
            ]
        },
        {
            "title": "Provence Lavender Fields 17th-Century Chateau",
            "description": "Immerse yourself in authentic French country living surrounded by 20 acres of blooming lavender and olive groves. Features heated stone pool and wine cellar.",
            "category": "Countryside",
            "property_type": "Chateau",
            "room_type": "Entire place",
            "address": "Route de Gordes",
            "city": "Gordes",
            "state": "Provence",
            "country": "France",
            "price_per_night": 820.0,
            "cleaning_fee": 180.0,
            "service_fee": 100.0,
            "max_guests": 8,
            "bedrooms": 4,
            "beds": 4,
            "baths": 4.0,
            "rating": 4.94,
            "review_count": 31,
            "host": host3,
            "photos": [
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
            ]
        },
        {
            "title": "Lake Tahoe Private Dock Estate & Boathouse",
            "description": "Stunning emerald waterfront residence with deep-water private pier, stone patio with outdoor fireplace, kayaks, paddleboards, and floor-to-ceiling lake views.",
            "category": "Lakefront",
            "property_type": "House",
            "room_type": "Entire place",
            "address": "420 Lakeshore Blvd",
            "city": "Incline Village",
            "state": "Nevada",
            "country": "United States",
            "price_per_night": 890.0,
            "cleaning_fee": 220.0,
            "service_fee": 110.0,
            "max_guests": 8,
            "bedrooms": 4,
            "beds": 5,
            "baths": 3.5,
            "rating": 4.97,
            "review_count": 53,
            "host": host1,
            "photos": [
                "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1476514525535-ce74f458149e?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80"
            ]
        },
        {
            "title": "Retro 70s A-Frame Modern Mountain Lodge",
            "description": "Architectural masterpiece featured in Architectural Digest. Soaring timber beams, vintage record player, cozy reading nooks, modern designer kitchen, and starry deck.",
            "category": "Icons",
            "property_type": "A-Frame",
            "room_type": "Entire place",
            "address": "550 Pinecone Way",
            "city": "Big Bear",
            "state": "California",
            "country": "United States",
            "price_per_night": 340.0,
            "cleaning_fee": 90.0,
            "service_fee": 40.0,
            "max_guests": 4,
            "bedrooms": 2,
            "beds": 2,
            "baths": 2.0,
            "rating": 4.93,
            "review_count": 92,
            "host": host2,
            "photos": [
                "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80"
            ]
        },
        {
            "title": "Modernist Kyoto Bamboo Forest Machiya",
            "description": "A restored 100-year-old traditional Japanese wooden house integrated with sleek minimalist steel and glass. Features private Zen stone garden and cedar soaking tub.",
            "category": "Countryside",
            "property_type": "Machiya",
            "room_type": "Entire place",
            "address": "Arashiyama Bamboo Lane 14",
            "city": "Kyoto",
            "state": "Kansai",
            "country": "Japan",
            "price_per_night": 460.0,
            "cleaning_fee": 70.0,
            "service_fee": 50.0,
            "max_guests": 4,
            "bedrooms": 2,
            "beds": 4,
            "baths": 1.5,
            "rating": 4.98,
            "review_count": 47,
            "host": host3,
            "photos": [
                "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1528164344705-47542687990d?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80"
            ]
        },
        {
            "title": "Bali Jungle Treehouse & Private Lagoon",
            "description": "Suspended above the lush rainforest canopy of Ubud, Bali. Open-air living room, natural infinity spring water pool, hammocks, and bamboo architecture.",
            "category": "OMG!",
            "property_type": "Treehouse",
            "room_type": "Entire place",
            "address": "Jalan Raya Tegallalang",
            "city": "Ubud",
            "state": "Bali",
            "country": "Indonesia",
            "price_per_night": 320.0,
            "cleaning_fee": 50.0,
            "service_fee": 35.0,
            "max_guests": 2,
            "bedrooms": 1,
            "beds": 1,
            "baths": 1.0,
            "rating": 4.96,
            "review_count": 110,
            "host": host2,
            "photos": [
                "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
            ]
        }
    ]

    for item in listings_data:
        photos = item.pop("photos")
        host = item.pop("host")
        listing = models.Listing(**item, host_id=host.id)
        listing.amenities = amenities_db[:8]
        db.add(listing)
        db.commit()
        db.refresh(listing)

        for idx, url in enumerate(photos):
            photo = models.ListingPhoto(
                listing_id=listing.id,
                url=url,
                is_cover=(idx == 0),
                order=idx
            )
            db.add(photo)

        # Add pre-existing reviews
        rev1 = models.Review(
            listing_id=listing.id,
            user_id=guest1.id,
            rating=5.0,
            cleanliness=5.0,
            accuracy=5.0,
            communication=5.0,
            location=5.0,
            check_in_rating=5.0,
            value_rating=5.0,
            comment="Absolutely magical stay! The pictures don't even do justice to how stunning the view and space were. Host was incredibly responsive."
        )
        rev2 = models.Review(
            listing_id=listing.id,
            user_id=host2.id if host.id != host2.id else host1.id,
            rating=4.9,
            cleanliness=5.0,
            accuracy=4.9,
            communication=5.0,
            location=5.0,
            check_in_rating=5.0,
            value_rating=4.8,
            comment="Immaculate property. The amenities, bed comfort, and kitchen equipment exceeded expectations. Highly recommend!"
        )
        db.add_all([rev1, rev2])
        db.commit()

    print("Seeding Bookings...")
    # Add pre-existing booking for Malibu house to block dates
    first_listing = db.query(models.Listing).first()
    if first_listing:
        b1 = models.Booking(
            listing_id=first_listing.id,
            user_id=guest1.id,
            check_in="2026-10-15",
            check_out="2026-10-20",
            guests_count=2,
            adults=2,
            children=0,
            infants=0,
            pets=0,
            nightly_price=first_listing.price_per_night,
            cleaning_fee=first_listing.cleaning_fee,
            service_fee=first_listing.service_fee,
            total_price=first_listing.price_per_night * 5 + first_listing.cleaning_fee + first_listing.service_fee,
            status="confirmed",
            payment_method="Credit Card"
        )
        db.add(b1)
        db.commit()

    print("Database successfully seeded!")
    db.close()

if __name__ == "__main__":
    seed_db()
