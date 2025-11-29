import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TravelContext = createContext();

export const useTravelContext = () => useContext(TravelContext);

export const TravelProvider = ({ children }) => {
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
    currency: 'USD'
  });

  // Load data from AsyncStorage
  useEffect(() => {
    loadData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    saveData();
  }, [budget, expenses, packingItems, itinerary, tripInfo]);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('travelData');
      if (data) {
        const parsed = JSON.parse(data);
        setBudget(parsed.budget || budget);
        setExpenses(parsed.expenses || []);
        setPackingItems(parsed.packingItems || []);
        setItinerary(parsed.itinerary || []);
        setTripInfo(parsed.tripInfo || tripInfo);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('travelData', JSON.stringify({
        budget, expenses, packingItems, itinerary, tripInfo
      }));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addExpense = (expense) => {
    setExpenses([...expenses, { ...expense, id: Date.now().toString() }]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const addPackingItem = (item) => {
    setPackingItems([...packingItems, { ...item, id: Date.now().toString(), packed: false }]);
  };

  const togglePackingItem = (id) => {
    setPackingItems(packingItems.map(item => 
      item.id === id ? { ...item, packed: !item.packed } : item
    ));
  };

  const deletePackingItem = (id) => {
    setPackingItems(packingItems.filter(item => item.id !== id));
  };

  const addItineraryItem = (item) => {
    setItinerary([...itinerary, { ...item, id: Date.now().toString() }]);
  };

  const deleteItineraryItem = (id) => {
    setItinerary(itinerary.filter(item => item.id !== id));
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getRemainingBudget = () => {
    return budget.total - getTotalExpenses();
  };

  const getExpensesByCategory = () => {
    return expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});
  };

  return (
    <TravelContext.Provider value={{
      budget, setBudget,
      expenses, addExpense, deleteExpense,
      packingItems, addPackingItem, togglePackingItem, deletePackingItem,
      itinerary, addItineraryItem, deleteItineraryItem,
      tripInfo, setTripInfo,
      getTotalExpenses, getRemainingBudget, getExpensesByCategory
    }}>
      {children}
    </TravelContext.Provider>
  );
};
