import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

// Icon paths mapping
const ICON_PATHS = {
    // Expense/Budget Categories
    stay: require('../../assets/icons/iconsax/iconsax-building-4-c10zeey8-.svg'),
    accommodation: require('../../assets/icons/iconsax/iconsax-building-4-c10zeey8-.svg'),
    transport: require('../../assets/icons/iconsax/iconsax-car-iq47uanx-.svg'),
    food: require('../../assets/icons/iconsax/iconsax-menu-board-tm67mo6m-.svg'),
    activities: require('../../assets/icons/iconsax/iconsax-zipline-h8ttx8zv-.svg'),
    shopping: require('../../assets/icons/iconsax/iconsax-shopping-bag-2r7tl913-.svg'),
    other: require('../../assets/icons/iconsax/iconsax-note-text-78btokjb-.svg'),

    // Packing Categories
    essentials: require('../../assets/icons/iconsax/iconsax-bag-cross-r9mlbzsk-.svg'),
    clothing: require('../../assets/icons/iconsax/iconsax-shop-oci6wzbn-.svg'),
    toiletries: require('../../assets/icons/iconsax/iconsax-apple-6d3q53g0-.svg'),
    electronics: require('../../assets/icons/iconsax/iconsax-mouse-eegu09vr-.svg'),
    documents: require('../../assets/icons/iconsax/iconsax-note-text-78btokjb-.svg'),
    accessories: require('../../assets/icons/iconsax/iconsax-heart-mg0g8za4-.svg'),
    health: require('../../assets/icons/iconsax/iconsax-hospital-zz0p1vkv-.svg'),

    // Itinerary Types
    flight: require('../../assets/icons/iconsax/iconsax-airplane-ga5xbfem-.svg'),
    train: require('../../assets/icons/iconsax/iconsax-routing-8l0zinwy-.svg'),
    bus: require('../../assets/icons/iconsax/iconsax-bus-n8ss4fo5-.svg'),
    car: require('../../assets/icons/iconsax/iconsax-car-iq47uanx-.svg'),
    taxi: require('../../assets/icons/iconsax/iconsax-driving-395x3t2l-.svg'),
    hotel: require('../../assets/icons/iconsax/iconsax-building-4-c10zeey8-.svg'),
    checkin: require('../../assets/icons/iconsax/iconsax-directbox-receive-ise382zo-.svg'),
    checkout: require('../../assets/icons/iconsax/iconsax-directbox-send-gip83s9i-.svg'),
    breakfast: require('../../assets/icons/iconsax/iconsax-menu-board-tm67mo6m-.svg'),
    lunch: require('../../assets/icons/iconsax/iconsax-menu-board-tm67mo6m-.svg'),
    dinner: require('../../assets/icons/iconsax/iconsax-menu-board-tm67mo6m-.svg'),
    cafe: require('../../assets/icons/iconsax/iconsax-menu-board-tm67mo6m-.svg'),
    attraction: require('../../assets/icons/iconsax/iconsax-courthouse-iemaewt5-.svg'),
    tour: require('../../assets/icons/iconsax/iconsax-map-1-oumecant-.svg'),
    nature: require('../../assets/icons/iconsax/iconsax-ai-landscape-rlrczekj-.svg'),
    beach: require('../../assets/icons/iconsax/iconsax-ai-water-cycle-60aapi1v-.svg'),
    museum: require('../../assets/icons/iconsax/iconsax-bank-p30evtna-.svg'),
    nightlife: require('../../assets/icons/iconsax/iconsax-notification-bing-hfke46y6-.svg'),

    // Trip Types
    solo: require('../../assets/icons/iconsax/iconsax-profile-qo56w39y-.svg'),
    friends: require('../../assets/icons/iconsax/iconsax-people-ruekv0vr-.svg'),
    family: require('../../assets/icons/iconsax/iconsax-ai-users-grnibjtm-.svg'),
    couple: require('../../assets/icons/iconsax/iconsax-ai-loveletter-69jmzorj-.svg'),
    business: require('../../assets/icons/iconsax/iconsax-buildings-2coqte5m-.svg'),

    // Navigation/General
    home: require('../../assets/icons/iconsax/iconsax-house-wt04akfh-.svg'),
    budget: require('../../assets/icons/iconsax/iconsax-coin-1-aimiall0-.svg'),
    expenses: require('../../assets/icons/iconsax/iconsax-receipt-text-5pe6cymb-.svg'),
    packing: require('../../assets/icons/iconsax/iconsax-bag-cross-r9mlbzsk-.svg'),
    itinerary: require('../../assets/icons/iconsax/iconsax-calendar-yua0vy04-.svg'),
    profile: require('../../assets/icons/iconsax/iconsax-profile-circle-hequbc0e-.svg'),
    settings: require('../../assets/icons/iconsax/iconsax-setting-2-r2lvagyp-.svg'),
    add: require('../../assets/icons/iconsax/iconsax-add-circle-k493lzbr-.svg'),
    close: require('../../assets/icons/iconsax/iconsax-add-circle-k493lzbr-.svg'), // Rotated in component
    delete: require('../../assets/icons/iconsax/iconsax-profile-delete-qwx8i4qa-.svg'),
    link: require('../../assets/icons/iconsax/iconsax-link-4-u46r0iue-.svg'),
    edit: require('../../assets/icons/iconsax/iconsax-edit-2-oscklgij-.svg'),
    calendar: require('../../assets/icons/iconsax/iconsax-calendar-yua0vy04-.svg'),
    location: require('../../assets/icons/iconsax/iconsax-location-tick-518ccx0b-.svg'),
    notification: require('../../assets/icons/iconsax/iconsax-notification-sw87na4x-.svg'),
    logout: require('../../assets/icons/iconsax/iconsax-logout-02-15y79pes-.svg'),
    lock: require('../../assets/icons/iconsax/iconsax-lock-osvquws1-.svg'),
    user: require('../../assets/icons/iconsax/iconsax-profile-qo56w39y-.svg'),
    group: require('../../assets/icons/iconsax/iconsax-profile-2user-bthuew2f-.svg'),
    map: require('../../assets/icons/iconsax/iconsax-map-dol3q51w-.svg'),
    search: require('../../assets/icons/iconsax/iconsax-global-search-ohzct99f-.svg'),
    clock: require('../../assets/icons/iconsax/iconsax-clock-hsugesjz-.svg'),
    money: require('../../assets/icons/iconsax/iconsax-money-recive-1w03lhjp-.svg'),
    discount: require('../../assets/icons/iconsax/iconsax-discount-shape-yvfhuaft-.svg'),
    chart: require('../../assets/icons/iconsax/iconsax-chart-u5hqhhtx-.svg'),
    task: require('../../assets/icons/iconsax/iconsax-task-07f7qat2-.svg'),
    like: require('../../assets/icons/iconsax/iconsax-like-1-33bwid71-.svg'),
    heart: require('../../assets/icons/iconsax/iconsax-heart-mg0g8za4-.svg'),
    airplane: require('../../assets/icons/iconsax/iconsax-airplane-ga5xbfem-.svg'),
    ship: require('../../assets/icons/iconsax/iconsax-ship-jhv8fxlt-.svg'),
    truck: require('../../assets/icons/iconsax/iconsax-truck-fast-5lpvosuw-.svg'),
    wallet: require('../../assets/icons/iconsax/iconsax-empty-wallet-time-mzcz1prb-.svg'),
    message: require('../../assets/icons/iconsax/iconsax-messages-2-7m77wl5f-.svg'),
    back: require('../../assets/icons/iconsax/iconsax-arrow-back-k813no41-.svg'),
};

/**
 * Icon Component - Renders SVG icons using Image (for web/cross-platform)
 * @param {string} name - Icon name from ICON_PATHS
 * @param {number} size - Icon size (default: 24)
 * @param {string} color - Tint color for the icon (optional)
 * @param {object} style - Additional styles
 */
const Icon = ({ name, size = 24, color, style }) => {
    const iconSource = ICON_PATHS[name] || ICON_PATHS.other;

    return (
        <Image
            source={iconSource}
            style={[
                { width: size, height: size },
                color && { tintColor: color },
                name === 'close' && { transform: [{ rotate: '45deg' }] },
                style
            ]}
            resizeMode="contain"
        />
    );
};

export default Icon;

// Export the icon names for reference
export const IconNames = Object.keys(ICON_PATHS);
