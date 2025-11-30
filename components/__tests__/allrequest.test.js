// 1️⃣ MOCKS ANTES DE NADA
jest.mock('expo-font', () => ({
  __esModule: true, // necesario si usas import Font from 'expo-font'
  loadAsync: jest.fn().mockResolvedValue(true),
  isLoaded: jest.fn().mockReturnValue(true),
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

// 2️⃣ IMPORTS
import React from 'react';
import AllRequests from '../AllRequests';
import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent,getAllByTestId } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';

describe('tests functions', () => {
  const mockData = [
    { id: 'REQ-001', status: 'Open', category: 'Hardware', subject: 'Laptop not turning on', creationDate: '2023-11-01', priority: 'High' },
    { id: 'REQ-002', status: 'Closed', category: 'Software', subject: 'App crashes when opening', creationDate: '2023-10-21', priority: 'Medium' },
    { id: 'REQ-003', status: 'In Progress', category: 'Network', subject: 'WiFi unstable', creationDate: '2023-09-10', priority: 'Low' },
  ];

  it('tests handleSearch', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <NavigationContainer>
        <PaperProvider>
          <AllRequests data={mockData} />
        </PaperProvider>
      </NavigationContainer>
    );

    const searchInput = getByPlaceholderText('Search the request');
    fireEvent.changeText(searchInput, 'Laptop');

    expect(getByText('Laptop not turning on')).toBeTruthy();
    expect(queryByText('App crashes when opening')).toBeNull();
    expect(queryByText('WiFi unstable')).toBeNull();
    expect(searchInput.props.value).toBe('Laptop');
  });

  it('tests handleNavigate', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <PaperProvider>
          <AllRequests data={mockData} iStatus={'Open'} />
        </PaperProvider>
      </NavigationContainer>
    );

    const mainButton = getByTestId('navigateButton');
    fireEvent.press(mainButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      "ReqFilter",
      expect.objectContaining({
        onGoBack: expect.any(Function),
        cat: expect.any(Function),
      })
    );
  });

  it('tests antDesign button navigation', () => {
    const { getByTestId,getAllByTestId } = render(
      <NavigationContainer>
        <PaperProvider>
          <AllRequests data={mockData} iStatus={'Open'} />
        </PaperProvider>
      </NavigationContainer>
    );

    const buttons = getAllByTestId('antDesign'); // devuelve un array
    const firstButton = buttons[0]; // primer elemento
    fireEvent.press(firstButton);

    

    expect(mockNavigate).toHaveBeenCalledWith(
      'RequestDetails',
      expect.objectContaining({
        item: expect.any(Object),
        reqTitle: expect.any(String)
      })
    );
  });
});
