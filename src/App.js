import React, { useState, useEffect } from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "./App.css";

function App() {
  const [baseCurrency, setBaseCurrency] = useState("usd");
  const [convertToCurrency, setConvertToCurrency] = useState("eur");
  const [currencyList, setCurrencyList] = useState([]);
  const [dropdownList, setDropdownList] = useState([]);
  const [amountToConvert, setAmountToConvert] = useState(1);
  const [convertedValue, setConvertedValue] = useState(0);
  const [hasAnError, setHasAnError] = useState(false);

  useEffect(() => {
    Axios.get(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${baseCurrency}.json`
    )
      .then((res) => {
        setCurrencyList(res.data[baseCurrency]);
      })
      .then(() => {
        setConvertedValue(amountToConvert * currencyList[convertToCurrency]);
      });
  }, [baseCurrency, amountToConvert, convertToCurrency, currencyList]);

  useEffect(() => {
    setDropdownList(Object.keys(currencyList).map((x) => x.toUpperCase()));
  }, [currencyList]);

  const baseCurrencyChangeHandler = (event) => {
    setBaseCurrency(event.value.toLowerCase());
  };
  const convertedCurrencyChangeHandler = (event) => {
    setConvertToCurrency(event.value.toLowerCase());
  };
  const currencyConversionAmountHandler = (event) => {
    setAmountToConvert(event.target.value);
  };
  const swapHandler = () => {
    let temValue = baseCurrency;
    setBaseCurrency(convertToCurrency);
    setConvertToCurrency(temValue);
  };

  useEffect(() => {
    setHasAnError(isNaN(amountToConvert));
  }, [amountToConvert]);

  const amountInputClasses = hasAnError ? "amount invalid" : "amount";

  return (
    <div className="card">
      <div className="title">Currency Converter</div>
      <div className="conversion">
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            className={amountInputClasses}
            value={amountToConvert}
            type="text"
            placeholder="Enter Amount To Convert"
            onChange={currencyConversionAmountHandler}
          />
          {hasAnError && <p className="error-text">Please use numbers only.</p>}
        </div>
        <div className="dropdown-swap">
          <div>
            <label>From</label>
            <Dropdown
              className="dropdown"
              options={dropdownList}
              placeholder="from"
              value={baseCurrency.toUpperCase()}
              onChange={baseCurrencyChangeHandler}
            />
          </div>
          <div>
            <button className="button" onClick={swapHandler}>
              <FontAwesomeIcon icon={faExchangeAlt} />
            </button>
          </div>
          <div>
            <label>To</label>
            <Dropdown
              className="dropdown"
              options={dropdownList}
              placeholder="to"
              value={convertToCurrency.toUpperCase()}
              onChange={convertedCurrencyChangeHandler}
            />
          </div>
        </div>
      </div>
      <div className="value">
        <p className="currencyToConvert">{`${amountToConvert} ${baseCurrency.toUpperCase()} = `}</p>
        <p className="convertedCurrency">
          {`${parseFloat(convertedValue).toFixed(
            2
          )} ${convertToCurrency.toUpperCase()}`}{" "}
        </p>
      </div>
      <a
        href="https://github.com/Wandervelt/currencyConverter"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon className="githubIcon" icon={faGithub} size="3x" />
      </a>
    </div>
  );
}

export default App;
