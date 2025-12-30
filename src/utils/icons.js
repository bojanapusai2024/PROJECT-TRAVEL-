// Icon mapping for the Travel App
// Using new PNG collection from mycollection/png

// Expense/Budget Categories
export const CategoryIcons = {
    accommodation: require('../../assets/icons/mycollection/png/030-hotel.png'),
    stay: require('../../assets/icons/mycollection/png/030-hotel.png'),
    transport: require('../../assets/icons/mycollection/png/009-road-trip.png'),
    food: require('../../assets/icons/mycollection/png/202-food.png'),
    activities: require('../../assets/icons/mycollection/png/150-climbing.png'), // Climbing
    shopping: require('../../assets/icons/mycollection/png/002-travel-bag.png'),
    other: require('../../assets/icons/mycollection/png/014-tourism.png'),
};

// Packing Categories
export const PackingIcons = {
    essentials: require('../../assets/icons/mycollection/png/206-packing.png'),
    clothing: require('../../assets/icons/mycollection/png/002-travel-bag.png'),
    toiletries: require('../../assets/icons/mycollection/png/125-healthy-food.png'),
    electronics: require('../../assets/icons/mycollection/png/208-webcam.png'),
    documents: require('../../assets/icons/mycollection/png/028-creativity.png'),
    accessories: require('../../assets/icons/mycollection/png/004-honeymoon.png'),
    health: require('../../assets/icons/mycollection/png/125-healthy-food.png'),
    other: require('../../assets/icons/mycollection/png/014-tourism.png'),
};

// Itinerary Types
export const ItineraryIcons = {
    flight: require('../../assets/icons/mycollection/png/188-airplane.png'),
    train: require('../../assets/icons/mycollection/png/180-train.png'),
    bus: require('../../assets/icons/mycollection/png/173-bus.png'),
    car: require('../../assets/icons/mycollection/png/009-road-trip.png'),
    taxi: require('../../assets/icons/mycollection/png/168-motorcycle.png'),
    hotel: require('../../assets/icons/mycollection/png/030-hotel.png'),
    checkin: require('../../assets/icons/mycollection/png/137-check-in.png'),
    checkout: require('../../assets/icons/mycollection/png/140-check-out.png'),
    breakfast: require('../../assets/icons/mycollection/png/135-hot-drink.png'),
    lunch: require('../../assets/icons/mycollection/png/133-hot-dog.png'),
    dinner: require('../../assets/icons/mycollection/png/127-pizza.png'),
    cafe: require('../../assets/icons/mycollection/png/135-hot-drink.png'),
    attraction: require('../../assets/icons/mycollection/png/014-tourism.png'),
    tour: require('../../assets/icons/mycollection/png/121-map.png'),
    shopping: require('../../assets/icons/mycollection/png/002-travel-bag.png'),
    nature: require('../../assets/icons/mycollection/png/021-hiking.png'),
    beach: require('../../assets/icons/mycollection/png/179-beach-chair.png'),
    museum: require('../../assets/icons/mycollection/png/186-temple.png'),
    nightlife: require('../../assets/icons/mycollection/png/020-stars.png'),
};

// Trip Types
export const TripTypeIcons = {
    solo: require('../../assets/icons/mycollection/png/185-traveller.png'),
    friends: require('../../assets/icons/mycollection/png/032-group.png'),
    family: require('../../assets/icons/mycollection/png/191-family.png'),
    couple: require('../../assets/icons/mycollection/png/110-valentines-day.png'),
    business: require('../../assets/icons/mycollection/png/029-bussiness-man.png'),
};

// Navigation/General
export const NavIcons = {
    home: require('../../assets/icons/mycollection/png/001-travel.png'),
    budget: require('../../assets/icons/mycollection/png/062-budget.png'),
    expenses: require('../../assets/icons/mycollection/png/060-expenses.png'),
    packing: require('../../assets/icons/mycollection/png/206-packing.png'),
    itinerary: require('../../assets/icons/mycollection/png/102-calendar.png'),
    profile: require('../../assets/icons/mycollection/png/056-profile-avatar.png'),
    settings: require('../../assets/icons/mycollection/png/068-scales.png'),
    add: require('../../assets/icons/mycollection/png/105-add-event.png'),
    edit: require('../../assets/icons/mycollection/png/104-edit.png'),
    calendar: require('../../assets/icons/mycollection/png/102-calendar.png'),
    location: require('../../assets/icons/mycollection/png/164-location-pin.png'),
    notification: require('../../assets/icons/mycollection/png/144-reception-bell.png'),
    logout: require('../../assets/icons/mycollection/png/118-logout.png'),
    lock: require('../../assets/icons/mycollection/png/115-password.png'),
    user: require('../../assets/icons/mycollection/png/057-user.png'),
    group: require('../../assets/icons/mycollection/png/194-tourists.png'),
    map: require('../../assets/icons/mycollection/png/121-map.png'),
    search: require('../../assets/icons/mycollection/png/155-binoculars.png'),
    clock: require('../../assets/icons/mycollection/png/148-hourglass.png'),
    money: require('../../assets/icons/mycollection/png/061-dollar.png'),
    discount: require('../../assets/icons/mycollection/png/020-stars.png'),
    chart: require('../../assets/icons/mycollection/png/069-donut-chart.png'),
    task: require('../../assets/icons/mycollection/png/107-schedule.png'),
    like: require('../../assets/icons/mycollection/png/020-stars.png'),
    heart: require('../../assets/icons/mycollection/png/004-honeymoon.png'),
};

// Get icon by category key
export const getCategoryIcon = (key) => {
    return CategoryIcons[key] || CategoryIcons.other;
};

export const getPackingIcon = (key) => {
    return PackingIcons[key] || PackingIcons.other;
};

export const getItineraryIcon = (key) => {
    return ItineraryIcons[key] || ItineraryIcons.hotel;
};

export const getTripTypeIcon = (type) => {
    return TripTypeIcons[type] || TripTypeIcons.solo;
};

export const getNavIcon = (key) => {
    return NavIcons[key] || NavIcons.home;
};
