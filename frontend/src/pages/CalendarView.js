import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../components/header/Header";
import DateColumn from './DateColumn';
import pencil from "../assets/pencil.png";

import "./CalendarView.css"

const CalendarView = () => {
	const mondayToday = new Date();
	mondayToday.setDate(mondayToday.getDate() - mondayToday.getDay() + 1)
	const [firstDate] = useState(mondayToday);
	const [firstDateUpdate, setFirstDateUpdate] = useState(false);
	const [inventory, setInventory] = useState(null); // array of inventory data for specified dates
	const [datesToUpdate, setUpdates] = useState(null);
	const months = useMemo(() => {
		return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	}, []);

	const changeWeek = useCallback((forward) => {
		const daysAdjusted = forward ? 7 : -7;
		console.log("before: ", firstDate);
		firstDate.setDate(firstDate.getDate() + daysAdjusted);
		console.log("after: ", firstDate);
		setFirstDateUpdate(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const categories = useMemo(() => {
		return ["Bags", "Belts", "Books", "Dresses", "Hats",
			"Households", "Jackets", "Long-Sleeves", "Pants", "Jewelry",
			"Supplies", "Shirts", "Shoes", "Shorts", "Sunglasses", "Sweaters",
			"Tanks", "Ties", "Misc"]
	}, []);

	useEffect(() => {
		console.log(firstDate)
		const fetchInventory = async (startDate) => {
			const data = []; // array of data for the 5 days of current week
			let response;
			for (let i = 0; i < 5; i++) {
				try {
					const newDate = new Date();
					newDate.setDate(startDate.getDate() + i);
					const month = newDate.getMonth();
					const date = newDate.getDate();
					response = await fetch(`http://localhost:3001/getitems/${month + 1}%2F${date}_Items`, {
						method: 'GET',
					});
					if (!response.ok) data.push(undefined);
					else data.push(await response.json());
				}
				catch (err) {
					console.log(err);
					return;
				}
			}
			setInventory(data);
			console.log(data);
		}

		fetchInventory(firstDate).catch(err => console.log(err));
		setFirstDateUpdate(false);
	}, [firstDate, firstDateUpdate]);

	useEffect(() => {
		if (!inventory || !datesToUpdate) return;
		const updateInventory = async (fullDate) => {
			const month = fullDate.getMonth();
			const date = fullDate.getDate();
			let response;
			try {
				response = await fetch(`http://localhost:3001/updateitem/${month + 1}%2F${date}_Items/Bags/5`, {
					method: 'PUT',
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ data: inventory[fullDate.getDay() - 1] }),
				});
			}
			catch (err) {
				console.log(err);
			}
			console.log(response);
			// const json = await response.json();
			// console.log(json);
		}

		for (const date in datesToUpdate) {
			updateInventory(date).catch(err => console.log(err));
		}
		setUpdates(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [datesToUpdate, inventory]);

	useEffect(() => {
		// console.log(inventory)
	}, [inventory])

	const changeView = () => {
		console.log("clicked");
	};

	let month = firstDate.getMonth() + 1;
	let year = firstDate.getFullYear();

	let cat_arr = [];
	for (let i = 0; i < categories.length; i++) {
		cat_arr.push(
			<div className="category-column">
				<p>{categories[i]}</p>
			</div>
		);
	}
	const arr = [0, 1, 2, 3, 4]
	return (
		<><Header />
			<div className="test"></div>
			<div className="calendar-view">
				<div className={"month-picker"}>
					<h1 id='left-month-button' onClick={() => changeWeek(false)}>&lt;</h1>
					<h1>{months[month - 1]} {year}</h1>
					<h1 id='right-month-button' onClick={() => changeWeek(true)}>&gt;</h1>
				</div>
				<div className="calendar-with-button">
					<div className="calendar-grid">
						<button className="button" onClick={() => changeView()}>
							Categories
							<img src={pencil} alt='pencil' />
						</button>
						{cat_arr}
					</div>
					<div className='week-range'>
						{arr.map((i) => {
							let newDate = new Date();
							newDate.setDate(firstDate.getDate() + i);
							return <div className='date-column' key={i.uniqueID}>
								<DateColumn fullDate={newDate} inventory={inventory} setInventory={setInventory} dayInd={i} />
							</div>;
						})}
					</div>
				</div>
			</div>
		</>
	)
}

export default CalendarView