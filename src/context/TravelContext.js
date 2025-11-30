import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TravelContext = createContext(null);

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
];

export const useTravelContext = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravelContext must be used within TravelProvider');
  }
  return context;
};

export function TravelProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [budget, setBudget] = useState({
    total: 0,
    categories: {
      accommodation: 0,
      transport: 0,
      food: 0,
      activities: 0,
      shopping: 0,
      other: 0,
    }
  });

  const [expenses, setExpenses] = useState([]);
  const [packingItems, setPackingItems] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [tripInfo, setTripInfo] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    name: '',
    participants: [],
    tripCode: '',
    tripType: '',
    isCompleted: false,
  });

  const [tripHistory, setTripHistory] = useState([]);
  
  // Currency state
  const [currency, setCurrency] = useState(CURRENCIES[0]); // Default USD

  function generateTripCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveData();
    }
  }, [budget, expenses, packingItems, itinerary, tripInfo, isLoaded]);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('travelData');
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.budget) setBudget(parsed.budget);
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.packingItems) setPackingItems(parsed.packingItems);
        if (parsed.itinerary) setItinerary(parsed.itinerary);
        if (parsed.tripInfo) setTripInfo(parsed.tripInfo);
      }
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('travelData', JSON.stringify({
        budget, expenses, packingItems, itinerary, tripInfo
      }));
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  const addExpense = (expense) => {
    setExpenses(prev => [...prev, { ...expense, id: Date.now().toString() }]);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  };

  const getExpensesByCategory = () => {
    return expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
  };

  const getRemainingBudget = () => {
    return budget.total - getTotalExpenses();
  };

  const addPackingItem = (item) => {
    setPackingItems(prev => [...prev, { ...item, id: Date.now().toString(), packed: false }]);
  };

  const togglePackingItem = (id) => {
    setPackingItems(prev => prev.map(item => 
      item.id === id ? { ...item, packed: !item.packed } : item
    ));
  };

  const deletePackingItem = (id) => {
    setPackingItems(prev => prev.filter(item => item.id !== id));
  };

  const addItineraryItem = (item) => {
    setItinerary(prev => [...prev, { ...item, id: Date.now().toString() }]);
  };

  const deleteItineraryItem = (id) => {
    setItinerary(prev => prev.filter(item => item.id !== id));
  };

  const updateItineraryItem = (id, updates) => {
    setItinerary(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  // End trip and add to history
  const endTrip = () => {
    if (tripInfo.destination) {
      const completedTrip = {
        id: Date.now().toString(),
        ...tripInfo,
        isCompleted: true,
        completedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        totalSpent: getTotalExpenses(),
        budget: budget.total,
        expensesCount: expenses.length,
        activitiesCount: itinerary.length,
        packingItemsCount: packingItems.length,
        currency: currency.code,
      };
      
      setTripHistory(prev => [completedTrip, ...prev]);
      
      // Clear current trip
      clearTrip();
    }
  };

  // Clear current trip data
  const clearTrip = () => {
    setTripInfo({
      destination: '',
      startDate: '',
      endDate: '',
      name: '',
      participants: [],
      tripCode: '',
      tripType: '',
      isCompleted: false,
    });
    setBudget({ total: 0, categories: {} });
    setExpenses([]);
    setPackingItems([]);
    setItinerary([]);
  };

  // Delete trip from history
  const deleteTripFromHistory = (id) => {
    setTripHistory(prev => prev.filter(trip => trip.id !== id));
  };

  // Format amount with currency
  const formatCurrency = (amount) => {
    return `${currency.symbol}${amount.toLocaleString()}`;
  };

  const value = {
    tripInfo, setTripInfo,
    budget, setBudget,
    expenses, addExpense, deleteExpense, getTotalExpenses, getExpensesByCategory,
    packingItems, addPackingItem, togglePackingItem, deletePackingItem,
    itinerary, addItineraryItem, deleteItineraryItem, updateItineraryItem,
    getRemainingBudget,
    clearTrip,
    endTrip,
    tripHistory,
    deleteTripFromHistory,
    // Currency
    currency,
    setCurrency,
    currencies: CURRENCIES,
    formatCurrency,
    isLoaded,
  };

  return (
    <TravelContext.Provider value={value}>
      {children}
    </TravelContext.Provider>
  );
};
