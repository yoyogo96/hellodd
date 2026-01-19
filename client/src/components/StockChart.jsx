import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './StockChart.css';

function StockChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="chart-container">차트 데이터가 없습니다.</div>;
  }

  // Recharts 포맷으로 변환
  const chartData = data.map(item => ({
    date: new Date(item.timestamp).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
    price: item.close
  }));

  // Y축 범위 계산 (여유 있게)
  const prices = chartData.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1;
  const yDomain = [minPrice - padding, maxPrice + padding];

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            domain={yDomain}
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value) => [value.toLocaleString() + '원', '종가']}
            labelFormatter={(label) => label}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StockChart;
