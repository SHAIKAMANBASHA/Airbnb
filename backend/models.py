from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

# Many-to-Many junction table for Listing <-> Amenity
listing_amenity = Table(
    'listing_amenity',
    Base.metadata,
    Column('listing_id', Integer, ForeignKey('listings.id', ondelete='CASCADE'), primary_key=True),
    Column('amenity_id', Integer, ForeignKey('amenities.id', ondelete='CASCADE'), primary_key=True)
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    avatar_url = Column(String, nullable=True)
    is_host = Column(Boolean, default=False)
    superhost_status = Column(Boolean, default=False)
    joined_date = Column(String, default="2023")
    response_rate = Column(Integer, default=99) # e.g. 99%
    bio = Column(Text, nullable=True)

    listings = relationship("Listing", back_populates="host", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    wishlists = relationship("Wishlist", back_populates="user", cascade="all, delete-orphan")

class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False, index=True) # Beachfront, Cabins, Mansions, OMG!, etc.
    property_type = Column(String, nullable=False) # House, Apartment, Villa, Cabin
    room_type = Column(String, default="Entire place") # Entire place, Private room, Shared room
    address = Column(String, nullable=False)
    city = Column(String, nullable=False, index=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=False, default="United States")
    zipcode = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    price_per_night = Column(Float, nullable=False)
    cleaning_fee = Column(Float, default=50.0)
    service_fee = Column(Float, default=30.0)
    
    max_guests = Column(Integer, default=2)
    bedrooms = Column(Integer, default=1)
    beds = Column(Integer, default=1)
    baths = Column(Float, default=1.0)
    
    rating = Column(Float, default=5.0)
    review_count = Column(Integer, default=0)
    
    host_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    host = relationship("User", back_populates="listings")
    photos = relationship("ListingPhoto", back_populates="listing", cascade="all, delete-orphan", order_by="ListingPhoto.order")
    amenities = relationship("Amenity", secondary=listing_amenity, back_populates="listings")
    bookings = relationship("Booking", back_populates="listing", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="listing", cascade="all, delete-orphan")

class ListingPhoto(Base):
    __tablename__ = "listing_photos"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    url = Column(String, nullable=False)
    caption = Column(String, nullable=True)
    is_cover = Column(Boolean, default=False)
    order = Column(Integer, default=0)

    listing = relationship("Listing", back_populates="photos")

class Amenity(Base):
    __tablename__ = "amenities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    icon = Column(String, nullable=False) # icon name e.g. wifi, tv, pool, kitchen
    category = Column(String, default="Basics") # Basics, Features, Safety, Location

    listings = relationship("Listing", secondary=listing_amenity, back_populates="amenities")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    check_in = Column(String, nullable=False) # YYYY-MM-DD
    check_out = Column(String, nullable=False) # YYYY-MM-DD
    
    guests_count = Column(Integer, default=1)
    adults = Column(Integer, default=1)
    children = Column(Integer, default=0)
    infants = Column(Integer, default=0)
    pets = Column(Integer, default=0)
    
    nightly_price = Column(Float, nullable=False)
    cleaning_fee = Column(Float, default=0.0)
    service_fee = Column(Float, default=0.0)
    total_price = Column(Float, nullable=False)
    
    status = Column(String, default="confirmed") # confirmed, cancelled, completed
    payment_method = Column(String, default="Credit Card")
    created_at = Column(DateTime, default=datetime.utcnow)

    listing = relationship("Listing", back_populates="bookings")
    user = relationship("User", back_populates="bookings")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    rating = Column(Float, nullable=False, default=5.0)
    cleanliness = Column(Float, default=5.0)
    accuracy = Column(Float, default=5.0)
    communication = Column(Float, default=5.0)
    location = Column(Float, default=5.0)
    check_in_rating = Column(Float, default=5.0)
    value_rating = Column(Float, default=5.0)
    
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    listing = relationship("Listing", back_populates="reviews")
    user = relationship("User", back_populates="reviews")

class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="wishlists")
    listing = relationship("Listing")
