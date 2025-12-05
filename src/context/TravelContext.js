import React, { createContext, useState, useContext, useEffect } from 'react';
import { generateUniqueTripCode } from '../utils/tripCodeGenerator';
import { useAuth } from './AuthContext';
import * as DB from '../services/databaseService';

const TravelContext = createContext();

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', flag: '🇹🇭' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
];

const DEFAULT_CATEGORIES = [
  { key: 'accommodation', label: 'Stay', emoji: '🏨', color: '#8B5CF6', tip: '30-40%' },
  { key: 'transport', label: 'Transport', emoji: '🚗', color: '#3B82F6', tip: '15-25%' },
  { key: 'food', label: 'Food', emoji: '🍽️', color: '#F59E0B', tip: '20-30%' },
  { key: 'activities', label: 'Activities', emoji: '🎭', color: '#10B981', tip: '10-15%' },
  { key: 'shopping', label: 'Shopping', emoji: '🛍️', color: '#EC4899', tip: '5-10%' },
  { key: 'other', label: 'Other', emoji: '📦', color: '#6B7280', tip: '5-10%' },
];

export function TravelProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  
  const [tripInfo, setTripInfoState] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    name: '',
    participants: [],
    tripCode: '',
    tripType: '',
    isCompleted: false,
  });

  const [budget, setBudgetState] = useState({ total: 0, categories: {} });
  const [expenses, setExpenses] = useState([]);
  const [packingItems, setPackingItems] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [tripHistory, setTripHistory] = useState([]);
  const [allTrips, setAllTrips] = useState([]);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [customCategories, setCustomCategories] = useState(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);

  // Load data from Firebase when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    } else {
      // Clear local state when user logs out
      resetLocalState();
    }
  }, [isAuthenticated, user]);

  const resetLocalState = () => {
    setTripInfoState({
      destination: '', startDate: '', endDate: '', name: '',
      participants: [], tripCode: '', tripType: '', isCompleted: false,
    });
    setBudgetState({ total: 0, categories: {} });
    setExpenses([]);
    setPackingItems([]);
    setItinerary([]);
    setTripHistory([]);
    setAllTrips([]);
  };

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      console.log('Loading user data from Firebase...');
      
      // Load current trip info
      const currentTrip = await DB.getCurrentTripInfo();
      if (currentTrip) {
        setTripInfoState(currentTrip);
      }
      
      // Load budget
      const savedBudget = await DB.getBudget();
      setBudgetState(savedBudget);
      
      // Load expenses
      const savedExpenses = await DB.getExpenses();
      setExpenses(savedExpenses);
      
      // Load packing items
      const savedPackingItems = await DB.getPackingItems();
      setPackingItems(savedPackingItems);
      
      // Load itinerary
      const savedItinerary = await DB.getItinerary();
      setItinerary(savedItinerary);
      
      // Load all trips
      const savedTrips = await DB.getTrips();
      setAllTrips(savedTrips);
      
      // Load trip history
      const savedHistory = await DB.getTripHistory();
      setTripHistory(savedHistory);
      
      console.log('User data loaded successfully');
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Set trip info and save to Firebase
  const setTripInfo = async (updater) => {
    const newInfo = typeof updater === 'function' ? updater(tripInfo) : updater;
    
    if (newInfo.destination && !newInfo.tripCode) {
      newInfo.tripCode = generateUniqueTripCode();
    }
    if (newInfo.destination && !newInfo.id) {
      newInfo.id = `trip-${Date.now()}`;
    }
    
    setTripInfoState(newInfo);
    
    // Save to Firebase
    if (isAuthenticated && newInfo.destination) {
      try {
        await DB.saveCurrentTripInfo(newInfo);
      } catch (error) {
        console.error('Error saving trip info:', error);
      }
    }
  };

  // Set budget and save to Firebase
  const setBudget = async (updater) => {
    const newBudget = typeof updater === 'function' ? updater(budget) : updater;
    setBudgetState(newBudget);
    
    if (isAuthenticated) {
      try {
        await DB.saveBudget(newBudget);
      } catch (error) {
        console.error('Error saving budget:', error);
      }
    }
  };

  // Add expense and save to Firebase
  const addExpense = async (expense) => {
    const newExpense = {
      ...expense,
      id: expense.id || Date.now().toString(),
      paidBy: expense.paidBy || 'main_user',
      splitType: expense.splitType || 'equal',
      splitAmounts: expense.splitAmounts || {},
      beneficiaries: expense.beneficiaries || [],
      createdAt: Date.now(),
    };
    
    setExpenses(prev => [...prev, newExpense]);
    
    if (isAuthenticated) {
      try {
        await DB.saveExpense(newExpense);
      } catch (error) {
        console.error('Error saving expense:', error);
      }
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    
    if (isAuthenticated) {
      try {
        await DB.deleteExpenseFromDB(id);
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  // Add packing item
  const addPackingItem = async (item) => {
    const newItem = { ...item, id: Date.now().toString(), packed: false };
    setPackingItems(prev => [...prev, newItem]);
    
    if (isAuthenticated) {
      try {
        await DB.savePackingItem(newItem);
      } catch (error) {
        console.error('Error saving packing item:', error);
      }
    }
  };

  // Toggle packing item
  const togglePackingItem = async (id) => {
    const item = packingItems.find(i => i.id === id);
    setPackingItems(prev => prev.map(i => i.id === id ? { ...i, packed: !i.packed } : i));
    
    if (isAuthenticated && item) {
      try {
        await DB.updatePackingItem(id, { packed: !item.packed });
      } catch (error) {
        console.error('Error updating packing item:', error);
      }
    }
  };

  // Delete packing item
  const deletePackingItem = async (id) => {
    setPackingItems(prev => prev.filter(item => item.id !== id));
    
    if (isAuthenticated) {
      try {
        await DB.deletePackingItemFromDB(id);
      } catch (error) {
        console.error('Error deleting packing item:', error);
      }
    }
  };

  // Add itinerary item
  const addItineraryItem = async (item) => {
    const newItem = { ...item, id: Date.now().toString() };
    setItinerary(prev => [...prev, newItem]);
    
    if (isAuthenticated) {
      try {
        await DB.saveItineraryItem(newItem);
      } catch (error) {
        console.error('Error saving itinerary item:', error);
      }
    }
  };

  // Delete itinerary item
  const deleteItineraryItem = async (id) => {
    setItinerary(prev => prev.filter(item => item.id !== id));
    
    if (isAuthenticated) {
      try {
        await DB.deleteItineraryItemFromDB(id);
      } catch (error) {
        console.error('Error deleting itinerary item:', error);
      }
    }
  };

  // Update itinerary item
  const updateItineraryItem = (id, updates) => {
    setItinerary(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  // End trip - move to history
  const endTrip = async () => {
    if (tripInfo && tripInfo.destination) {
      const completedTrip = {
        ...tripInfo,
        id: `history-${Date.now()}`,
        isCompleted: true,
        completedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        totalSpent: getTotalExpenses(),
        budget: budget.total,
        expensesCount: expenses.length,
        currency: currency.code,
      };
      
      setTripHistory(prev => [completedTrip, ...prev]);
      
      if (isAuthenticated) {
        try {
          await DB.saveToHistory(completedTrip);
          await DB.clearCurrentTripData();
        } catch (error) {
          console.error('Error ending trip:', error);
        }
      }
      
      await clearTrip();
    }
  };

  // Clear current trip
  const clearTrip = async () => {
    setTripInfoState({
      destination: '', startDate: '', endDate: '', name: '',
      participants: [], tripCode: '', tripType: '', isCompleted: false,
    });
    setBudgetState({ total: 0, categories: {} });
    setExpenses([]);
    setPackingItems([]);
    setItinerary([]);
    
    if (isAuthenticated) {
      try {
        await DB.clearCurrentTripData();
      } catch (error) {
        console.error('Error clearing trip:', error);
      }
    }
  };

  // Save current trip to all trips list
  const saveCurrentTripToList = async () => {
    if (tripInfo && tripInfo.destination) {
      const tripToSave = {
        ...tripInfo,
        id: tripInfo.id || `trip-${Date.now()}`,
        tripCode: tripInfo.tripCode || generateUniqueTripCode(),
        totalExpenses: getTotalExpenses(),
        createdAt: Date.now(),
      };
      
      setAllTrips(prev => {
        const idx = prev.findIndex(t => t.id === tripToSave.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = tripToSave;
          return updated;
        }
        return [tripToSave, ...prev];
      });
      
      if (isAuthenticated) {
        try {
          await DB.saveTrip(tripToSave);
        } catch (error) {
          console.error('Error saving trip to list:', error);
        }
      }
      
      return tripToSave;
    }
    return null;
  };

  const getTotalExpenses = () => expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  
  const getExpensesByCategory = () => expenses.reduce((acc, e) => {
    const amount = parseFloat(e.amount) || 0;
    acc[e.category] = (acc[e.category] || 0) + amount;
    return acc;
  }, {});
  
  const getRemainingBudget = () => (budget.total || 0) - getTotalExpenses();
  
  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    if (currency.code === 'INR') {
      return `${currency.symbol}${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    }
    return `${currency.symbol}${num.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  };
  
  const isMultiUserTrip = () => tripInfo.tripType && tripInfo.tripType !== 'solo';
  
  const getAllTravelers = () => {
    const mainUser = { id: 'main_user', name: 'You', avatar: '👤' };
    return [mainUser, ...(tripInfo.participants || [])];
  };

  const deleteTripFromHistory = async (id) => {
    setTripHistory(prev => prev.filter(trip => trip.id !== id));
  };

  const deleteTrip = async (tripId) => {
    setAllTrips(prev => prev.filter(trip => trip.id !== tripId));
    if (isAuthenticated) {
      try {
        await DB.deleteTrip(tripId);
      } catch (error) {
        console.error('Error deleting trip:', error);
      }
    }
  };

  const switchToTrip = (trip) => {
    if (trip) setTripInfoState(trip);
  };

  const getTripByCode = (code) => allTrips.find(trip => trip.tripCode === code?.toUpperCase());
  const createNewTrip = () => saveCurrentTripToList();
  const getBalances = () => ({});
  const getSettlements = () => [];

  return (
    <TravelContext.Provider value={{
      tripInfo, setTripInfo,
      budget, setBudget,
      expenses, setExpenses, addExpense, deleteExpense,
      getTotalExpenses, getExpensesByCategory,
      packingItems, addPackingItem, togglePackingItem, deletePackingItem,
      itinerary, addItineraryItem, deleteItineraryItem, updateItineraryItem,
      getRemainingBudget,
      clearTrip, endTrip,
      tripHistory, setTripHistory, deleteTripFromHistory,
      currency, setCurrency, currencies: CURRENCIES,
      formatCurrency,
      customCategories, setCustomCategories,
      isMultiUserTrip, getAllTravelers, getBalances, getSettlements,
      allTrips, deleteTrip, createNewTrip, saveCurrentTripToList, getTripByCode, switchToTrip,
      isLoading,
    }}>
      {children}
    </TravelContext.Provider>
  );
}

export function useTravelContext() {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravelContext must be used within a TravelProvider');
  }
  return context;
}
