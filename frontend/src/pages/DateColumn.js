import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './DateColumn.css';

const DateColumn = ({ fullDate, inventory }) => {
	const categories = ["Bags", "Belts", "Books", "Dresses", "Hats",
		"Households", "Jackets", "Long-Sleeves", "Pants", "Jewelry",
		"Supplies", "Shirts", "Shoes", "Shorts", "Sunglasses", "Sweaters",
		"Tanks", "Ties", "Misc"];

	const getInventoryData = useCallback(() => {
		const inputValues = {};
		for (let i = 0; i < categories.length; i++) {
			if (inventory) {
				inputValues[categories[i]] = data[categories[i]];
				console.log(inputValues[categories[i]])
			} else {
				inputValues[categories[i]] = "0";
			}
		};
		return inputValues;
	}, []);


	const [input, setInput] = useState(false);
	const [data, setData] = useState(getInventoryData());
	const days = useMemo(() => {
		return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
	}, []);
	const [updated, setUpdate] = useState(false);

	useEffect(() => {
		console.log(data)
	}, [data])
	const getCurrentData = useCallback((changed) => {
		if (!changed) {
			return getInventoryData();
		}
		return data;
	}, []);

	const updateInventory = async (fullDate) => {
		const month = fullDate.getMonth();
		const date = fullDate.getDate();
		let response;
		try {
			response = await fetch(`http://localhost:3001/updateitem/${month + 1}%2F${date}_Items`, {
				method: 'GET',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({data: inventory[fullDate.getDay()-1]}),
			});
		}
		catch (err) {
			console.log(err);
		}
		console.log(response);
		// const json = await response.json();
		// console.log(json);
	};

	const keyPressed = async (e) => {
		if (e.key === 'Enter') {
			console.log("Enter");
			setData(getCurrentData(true));
			console.log(data)
			setInput(!input);
			setUpdate(true);
			await updateInventory(fullDate);
		}
		else if (e.key === 'Escape') {
			console.log("Escape");
			setData(getCurrentData(false));
			console.log(data)
			setInput(!input);
		}
	};

	if (!inventory)
		return (<></>)
	else if (input)
		return (
			<div className='date-container'
				onKeyDown={(e) => { keyPressed(e) }}>
				<h3>{fullDate.getDate()}</h3>
				<h3>{days[fullDate.getDay() - 1]}</h3>

				{categories.map((cat, i) => {
					return <div className="category">
						<input className="category" type="number"
							placeholder={updated ? data[categories[i]] : inventory[fullDate.getDay() - 1][i].quantity}
							min="0"
							max="99"
							onChange={(ele) => data[categories[i]] = ele.target.value}
						/>
					</div>;
				})}
			</div>
		)
	else
		return (
			<div className='date-container'>
				<h3>{fullDate.getDate()}</h3>
				<h3>{days[fullDate.getDay() - 1]}</h3>

				{categories.map((cat, i) => {
					return <div className="category category2">
						<h4 className="value" onClick={() => setInput(!input)} >
							{updated ? data[categories[i]] : inventory[fullDate.getDay() - 1][i].quantity}
						</h4>
					</div>;
				})}
			</div>
		)
}
export default DateColumn;