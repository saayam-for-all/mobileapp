import { useState, useRef, useCallback } from 'react';

/*
 * Hook for OpenStreetMap Nominatim location autocomplete.
 *
 * inputValue — the current text in the location search input.
 *   Managed here (not in the parent) so both manual typing and
 *   auto‑geolocation (getUserLocation) can set the displayed value
 *   without duplicating state.
 *
 * Debounce — a fixed 300 ms delay before firing the Nominatim API.
 *   Each keystroke resets the timer; the API call only goes out after
 *   the user stops typing for 300 ms. Minimum 3 characters required.
 *
 * Exponential retry — when the Nominatim API call fails, it is retried
 *   with increasing delays (exponential backoff):
 *
 *     1st retry →  200 ms
 *     2nd retry →  400 ms  (200 * 2)
 *     3rd retry →  800 ms  (400 * 2)
 *     4th retry → 1600 ms  (800 * 2)
 *     5th retry → 2000 ms  (cap, no further retries)
 *
 *   Max 5 retries total (1 initial call + 4 retries). After the cap or
 *   max retries is reached, suggestions stay empty.
 */

const BASE_RETRY_DELAY = 200;
const MAX_RETRY_DELAY = 2000;
const MAX_RETRIES = 4;
const DEBOUNCE_DELAY = 300;
const MIN_QUERY_LENGTH = 3;

const usePlacesSearchBox = () => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimer = useRef(null);
  const retryCount = useRef(0);

  const handleSearchChange = useCallback((value) => {
    setInputValue(value);

    if (value.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      // Reset retry counter for each new search
      retryCount.current = 0;
      await fetchSuggestions(value);
    }, DEBOUNCE_DELAY);
  }, []);

  const fetchSuggestions = async (value) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'SaayamForAll/1.0',
          },
        },
      );
      const data = await response.json();
      setSuggestions(data);
      retryCount.current = 0;
    } catch (error) {
      console.error('Error fetching suggestions:', error);

      if (retryCount.current < MAX_RETRIES) {
        // delay = base * 2^retryCount, capped at MAX_RETRY_DELAY
        const delay = Math.min(
          BASE_RETRY_DELAY * Math.pow(2, retryCount.current),
          MAX_RETRY_DELAY,
        );
        retryCount.current += 1;
        setTimeout(() => fetchSuggestions(value), delay);
      } else {
        setSuggestions([]);
        retryCount.current = 0;
      }
    }
  };

  const handleSelectSuggestion = useCallback((suggestion) => {
    setInputValue(suggestion.display_name);
    setSuggestions([]);
    return {
      display_name: suggestion.display_name,
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
    };
  }, []);

  return { inputValue, setInputValue, suggestions, handleSearchChange, handleSelectSuggestion };
};

export default usePlacesSearchBox;
