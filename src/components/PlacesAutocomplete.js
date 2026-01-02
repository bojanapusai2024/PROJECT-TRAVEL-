import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from './Icon';
import GOOGLE_MAPS_CONFIG from '../config/googleMaps';

/**
 * PlacesAutocomplete Component
 * Google Places Autocomplete for destination search (Web only)
 */
const PlacesAutocomplete = ({
    value,
    onPlaceSelect,
    placeholder = 'Search destination...',
    style,
}) => {
    const { colors } = useTheme();
    const [query, setQuery] = useState(value || '');
    const [predictions, setPredictions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const autocompleteService = useRef(null);
    const placesService = useRef(null);
    const debounceTimer = useRef(null);

    // Load Google Maps script dynamically and initialize services
    useEffect(() => {
        if (Platform.OS !== 'web') return;

        const GOOGLE_MAPS_API_KEY = GOOGLE_MAPS_CONFIG.apiKey;

        const loadGoogleMapsScript = () => {
            return new Promise((resolve, reject) => {
                // Check if already loaded
                if (window.google && window.google.maps && window.google.maps.places) {
                    resolve();
                    return;
                }

                // Check if script is already being loaded
                const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
                if (existingScript) {
                    existingScript.addEventListener('load', resolve);
                    return;
                }

                // Create and load the script
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    console.log('Google Maps script loaded');
                    resolve();
                };
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        const initGoogleServices = () => {
            if (window.google && window.google.maps && window.google.maps.places) {
                autocompleteService.current = new window.google.maps.places.AutocompleteService();
                const dummyDiv = document.createElement('div');
                placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
                console.log('Google Places initialized successfully');
                return true;
            }
            return false;
        };

        loadGoogleMapsScript()
            .then(() => {
                // Poll for Google services to be ready
                const checkInterval = setInterval(() => {
                    if (initGoogleServices()) {
                        clearInterval(checkInterval);
                    }
                }, 100);
                setTimeout(() => clearInterval(checkInterval), 5000);
            })
            .catch((error) => {
                console.error('Failed to load Google Maps script:', error);
            });
    }, []);

    useEffect(() => {
        setQuery(value || '');
    }, [value]);

    const searchPlaces = async (searchQuery) => {
        if (!searchQuery || searchQuery.length < 2) {
            setPredictions([]);
            setShowDropdown(false);
            return;
        }

        if (Platform.OS !== 'web' || !autocompleteService.current) {
            console.log('Google Places not available');
            return;
        }

        setIsLoading(true);

        try {
            autocompleteService.current.getPlacePredictions(
                {
                    input: searchQuery,
                    types: ['(cities)'],
                },
                (results, status) => {
                    setIsLoading(false);
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                        setPredictions(results.slice(0, 5));
                        setShowDropdown(true);
                    } else {
                        setPredictions([]);
                    }
                }
            );
        } catch (error) {
            console.error('Places search error:', error);
            setIsLoading(false);
            setPredictions([]);
        }
    };

    const handleInputChange = (text) => {
        setQuery(text);

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            searchPlaces(text);
        }, 300);
    };

    const handleSelectPlace = (prediction) => {
        setQuery(prediction.description);
        setShowDropdown(false);
        setPredictions([]);

        if (placesService.current) {
            placesService.current.getDetails(
                {
                    placeId: prediction.place_id,
                    fields: ['geometry', 'formatted_address', 'name', 'photos'],
                },
                (place, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
                        onPlaceSelect({
                            name: prediction.structured_formatting?.main_text || place.name,
                            fullAddress: prediction.description,
                            placeId: prediction.place_id,
                            latitude: place.geometry?.location?.lat(),
                            longitude: place.geometry?.location?.lng(),
                        });
                    } else {
                        onPlaceSelect({
                            name: prediction.structured_formatting?.main_text || prediction.description,
                            fullAddress: prediction.description,
                            placeId: prediction.place_id,
                        });
                    }
                }
            );
        } else {
            onPlaceSelect({
                name: prediction.structured_formatting?.main_text || prediction.description,
                fullAddress: prediction.description,
                placeId: prediction.place_id,
            });
        }
    };

    const styles = createStyles(colors);

    return (
        <View style={[styles.container, style]}>
            <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                    <Icon name="location" size={20} color={colors.primary} />
                </View>
                <TextInput
                    style={styles.input}
                    value={query}
                    onChangeText={handleInputChange}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textMuted}
                    onFocus={() => predictions.length > 0 && setShowDropdown(true)}
                />
                {isLoading && (
                    <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
                )}
                {query.length > 0 && !isLoading && (
                    <TouchableOpacity
                        onPress={() => {
                            setQuery('');
                            setPredictions([]);
                            setShowDropdown(false);
                            onPlaceSelect(null);
                        }}
                        style={styles.clearButton}
                    >
                        <Icon name="close" size={16} color={colors.textMuted} />
                    </TouchableOpacity>
                )}
            </View>

            {showDropdown && predictions.length > 0 && (
                <View style={styles.dropdown}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled
                        style={styles.dropdownScroll}
                    >
                        {predictions.map((prediction, index) => (
                            <TouchableOpacity
                                key={prediction.place_id}
                                style={[
                                    styles.predictionItem,
                                    index === predictions.length - 1 && styles.lastItem,
                                ]}
                                onPress={() => handleSelectPlace(prediction)}
                            >
                                <Icon name="location" size={16} color={colors.textMuted} style={styles.predictionIcon} />
                                <View style={styles.predictionText}>
                                    <Text style={styles.predictionMain} numberOfLines={1}>
                                        {prediction.structured_formatting?.main_text || prediction.description}
                                    </Text>
                                    <Text style={styles.predictionSecondary} numberOfLines={1}>
                                        {prediction.structured_formatting?.secondary_text || ''}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={styles.poweredBy}>
                        <Text style={styles.poweredByText}>Powered by Google</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const createStyles = (colors) =>
    StyleSheet.create({
        container: {
            position: 'relative',
            zIndex: 1000,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.cardLight,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.primaryBorder,
            paddingHorizontal: 4,
        },
        iconContainer: {
            width: 44,
            height: 44,
            borderRadius: 10,
            backgroundColor: colors.primaryMuted,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 4,
        },
        input: {
            flex: 1,
            fontSize: 16,
            color: colors.text,
            paddingVertical: 14,
            paddingHorizontal: 8,
            outlineStyle: 'none',
        },
        loader: {
            marginRight: 12,
        },
        clearButton: {
            padding: 12,
        },
        dropdown: {
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: colors.card,
            borderRadius: 14,
            marginTop: 8,
            borderWidth: 1,
            borderColor: colors.primaryBorder,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
            maxHeight: 250,
            overflow: 'hidden',
        },
        dropdownScroll: {
            maxHeight: 200,
        },
        predictionItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 14,
            borderBottomWidth: 1,
            borderBottomColor: colors.primaryBorder,
        },
        lastItem: {
            borderBottomWidth: 0,
        },
        predictionIcon: {
            marginRight: 12,
        },
        predictionText: {
            flex: 1,
        },
        predictionMain: {
            fontSize: 15,
            fontWeight: '600',
            color: colors.text,
        },
        predictionSecondary: {
            fontSize: 13,
            color: colors.textMuted,
            marginTop: 2,
        },
        poweredBy: {
            padding: 8,
            alignItems: 'center',
            borderTopWidth: 1,
            borderTopColor: colors.primaryBorder,
            backgroundColor: colors.cardLight,
        },
        poweredByText: {
            fontSize: 11,
            color: colors.textMuted,
        },
    });

export default PlacesAutocomplete;
