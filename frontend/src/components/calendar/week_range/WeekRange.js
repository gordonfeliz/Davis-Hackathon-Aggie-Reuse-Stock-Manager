import React from 'react';
import DateColumn from '../../../pages/DateColumn';
import './WeekRange.css';

// pass in the sunday Date object
const WeekRange = ({ startDate, inventory, setInventory }) => {
	const arr = [0, 1, 2, 3, 4]

	return (
		<div className='week-range'>
			console.log(startDate);
            {arr.map((i) => {
                let newDate = new Date();
                newDate.setDate(startDate.getDate() + i);
                return <div className='date-column' key={i.uniqueID}>
                    <DateColumn fullDate={newDate} inventory={inventory} setInventory={setInventory} />
                </div>;
            })}
		</div>
	)
}
export default WeekRange;