import React from 'react';
import { routes } from '../data/routes';

const DataTest: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px',
      border: '1px solid #ccc',
      margin: '10px 0'
    }}>
      <h3>データテスト</h3>
      <p>読み込まれた路線データ:</p>
      <ul>
        {Object.entries(routes).map(([routeKey, stations]) => (
          <li key={routeKey}>
            <strong>{routeKey}</strong>: {stations.length} 駅
            <ul>
              {stations.slice(0, 3).map((station, index) => (
                <li key={index}>{station.name} ({station.lat}, {station.lng})</li>
              ))}
              {stations.length > 3 && <li>... 他 {stations.length - 3} 駅</li>}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataTest;