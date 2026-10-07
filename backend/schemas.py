from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    name: str
    email: str
    avatar_url: Optional[str] = None
    is_host: bool = False
    superhost_status: bool = False
    joined_date: Optional[str] = "2023"
    response_rate: Optional[int] = 99
    bio: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

# Photo Schemas
class PhotoBase(BaseModel):
    url: str
    caption: Optional[str] = None
    is_cover: bool = False
    order: int = 0

class PhotoCreate(PhotoBase):
    pass

class PhotoResponse(PhotoBase):
    id: int
    listing_id: int

    class Config:
        from_attributes = True

# Amenity Schemas
class AmenityBase(BaseModel):
    name: str
    icon: str
    category: str = "Basics"

class AmenityResponse(AmenityBase):
    id: int

    class Config:
        from_attributes = True

# Listing Schemas
class ListingBase(BaseModel):
    title: str
    description: str
    category: str
    property_type: str
    room_type: str = "Entire place"
    address: str
    city: str
    state: Optional[str] = None
    country: str = "United States"
    zipcode: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    price_per_night: float
    cleaning_fee: float = 50.0
    service_fee: float = 30.0
    max_guests: int = 2
    bedrooms: int = 1
    beds: int = 1
    baths: float = 1.0

class ListingCreate(ListingBase):
    photos: List[str] = [] # list of photo URLs
    amenity_ids: List[int] = []

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    property_type: Optional[str] = None
    price_per_night: Optional[float] = None
    cleaning_fee: Optional[float] = None
    service_fee: Optional[float] = None
    max_guests: Optional[int] = None
    bedrooms: Optional[int] = None
    beds: Optional[int] = None
    baths: Optional[float] = None
    photos: Optional[List[str]] = None
    amenity_ids: Optional[List[int]] = None

class ListingResponse(ListingBase):
    id: int
    rating: float
    review_count: int
    host_id: int
    created_at: datetime
    host: UserResponse
    photos: List[PhotoResponse] = []
    amenities: List[AmenityResponse] = []

    class Config:
        from_attributes = True

# Review Schemas
class ReviewCreate(BaseModel):
    rating: float = Field(..., ge=1.0, le=5.0)
    cleanliness: float = 5.0
    accuracy: float = 5.0
    communication: float = 5.0
    location: float = 5.0
    check_in_rating: float = 5.0
    value_rating: float = 5.0
    comment: str

class ReviewResponse(BaseModel):
    id: int
    listing_id: int
    user_id: int
    rating: float
    cleanliness: float
    accuracy: float
    communication: float
    location: float
    check_in_rating: float
    value_rating: float
    comment: str
    created_at: datetime
    user: UserResponse

    class Config:
        from_attributes = True

# Booking Schemas
class BookingCreate(BaseModel):
    listing_id: int
    check_in: str # YYYY-MM-DD
    check_out: str # YYYY-MM-DD
    guests_count: int = 1
    adults: int = 1
    children: int = 0
    infants: int = 0
    pets: int = 0
    payment_method: str = "Credit Card"

class BookingResponse(BaseModel):
    id: int
    listing_id: int
    user_id: int
    check_in: str
    check_out: str
    guests_count: int
    adults: int
    children: int
    infants: int
    pets: int
    nightly_price: float
    cleaning_fee: float
    service_fee: float
    total_price: float
    status: str
    payment_method: str
    created_at: datetime
    listing: ListingResponse
    user: UserResponse

    class Config:
        from_attributes = True

class DateCheckRequest(BaseModel):
    listing_id: int
    check_in: str
    check_out: str

class DateCheckResponse(BaseModel):
    available: bool
    message: str
    booked_dates: List[str] = []

# Wishlist Schemas
class WishlistResponse(BaseModel):
    id: int
    user_id: int
    listing_id: int
    listing: ListingResponse

    class Config:
        from_attributes = True

# Host Stats Schema
class HostStatsResponse(BaseModel):
    total_listings: int
    total_reservations: int
    total_earnings: float
    average_rating: float
