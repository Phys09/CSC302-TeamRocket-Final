import { useEffect, useState } from 'react';
import { toTitleCase } from '../helpers/helpers';
import axios from '../axios';
import '../styles/GetDataForm.css';

export default function GetDataForm({ data, setData, setError }) {
  const [name, setName] = useState('');
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [countryNames, setCountryNames] = useState([]);
  const [nameSuggestions, setNameSuggestions] = useState([]);

  useEffect(() => {
    axios.get('/data/names').then((res) => {
      if (res.status === 200) {
        setCountryNames(res.data.data);
      }
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      data.find((dataSet) => dataSet.name.toLowerCase() === name.toLowerCase())
    ) {
      return;
    }

    // TODO: change endpoint to getDataByNameAndYearRange
    await axios
      .get(`/data/${name}`)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.data);
          console.log(startYear, endYear);
        }
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.error.msg);
        } else {
          setError(`Something went wrong: ${error}`);
        }
      });
  };

  const handleNameChange = (e) => {
    setName(e.target.value);

    const nameCandidates = countryNames.filter(
      (name) =>
        e.target.value !== '' &&
        name.toLowerCase().includes(e.target.value.toLowerCase())
    );

    setNameSuggestions(
      nameCandidates.map((name) => (
        <li key={name} onClick={() => setName(name)}>
          {toTitleCase(name)}
        </li>
      ))
    );
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <div className="nameField">
        <label htmlFor="name">Name:</label>
        <div className="suggestionsContainer">
          <input
            type="text"
            name="name"
            id="name"
            required={true}
            onChange={handleNameChange}
            value={name}
          />
          <ul className="suggestions">{nameSuggestions}</ul>
        </div>
      </div>
      <div>
        <label htmlFor="start-year">Start Year: </label>
        <input
          type="number"
          name="start-year"
          id="start-year"
          onChange={(e) => setStartYear(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="end-year">End Year: </label>
        <input
          type="number"
          name="end-year"
          id="end-year"
          onChange={(e) => setEndYear(parseInt(e.target.value))}
        />
      </div>
      <input type="submit" value="Add Country"></input>
    </form>
  );
}
