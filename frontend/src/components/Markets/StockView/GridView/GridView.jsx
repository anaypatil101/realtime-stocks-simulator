import React from 'react';
import GridViewSkeleton from './GridViewSkeleton';
import StockCard from '../../../StockCard/StockCard';

const GridView = (props) => {
  const { socket, filteredStocks } = props;

  return (
    <div className="py-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-stretch">
        {!filteredStocks?.length ?
          <GridViewSkeleton />
          :
          <>
            {filteredStocks.map((stock) => (
              <StockCard key={stock._id} stock={stock} socket={socket} />
            ))}
          </>
        }
      </div>
    </div>
  );
}

export default GridView;