import React, { useState } from 'react';

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
    if (selectedOptions.includes('Highest lowercase alphabet') && response.highest_lowercase_alphabet) {
      filteredResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
    }

    return (
      <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Enter JSON (e.g., { "data": ["A","C","z"] })'
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          rows="4"
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Submit
        </button>
      </form>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>
      )}

      {response && (
        <div style={{ marginTop: '20px' }}>
          <h2>Select filters:</h2>
          {['Alphabets', 'Numbers', 'Highest lowercase alphabet'].map((option) => (
            <label key={option} style={{ display: 'block', marginBottom: '5px' }}>
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionChange(option)}
                style={{ marginRight: '5px' }}
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
