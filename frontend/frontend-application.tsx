import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const App = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    try {
      const parsedInput = JSON.parse(input);
      
      // Call your API here
      const apiResponse = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedInput),
      });

      if (!apiResponse.ok) {
        throw new Error('API request failed');
      }

      const data = await apiResponse.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof SyntaxError ? 'Invalid JSON format' : 'An error occurred');
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    const filteredResponse = {};
    if (selectedOptions.includes('Alphabets') && response.alphabets) {
      filteredResponse.alphabets = response.alphabets;
    }
    if (selectedOptions.includes('Numbers') && response.numbers) {
      filteredResponse.numbers = response.numbers;
    }
    if (selectedOptions.includes('Highest lowercase alphabet') && response.highestLowercase) {
      filteredResponse.highestLowercase = response.highestLowercase;
    }

    return (
      <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
    );
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Enter JSON (e.g., { "data": ["A","C","z"] })'
          className="w-full p-2 border rounded mb-2"
          rows="4"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {response && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Select filters:</h2>
          {['Alphabets', 'Numbers', 'Highest lowercase alphabet'].map((option) => (
            <label key={option} className="flex items-center mb-1">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionChange(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )}

      {renderFilteredResponse()}
    </div>
  );
};

export default App;
