import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DistributionItem, ProductExperienceAverages } from '../../types/feedback';
import { formatRating } from '../../utils/calculations';

const CHART_COLORS = [
  '#1f5c45',
  '#3f8568',
  '#6aa388',
  '#c9922a',
  '#8f8578',
  '#9bc4ad',
];

interface RatingChartProps {
  averages: ProductExperienceAverages;
}

export function RatingChart({ averages }: RatingChartProps) {
  const data = [
    { name: 'Food Acceptance', value: averages.foodAcceptance },
    { name: 'Taste & Smell', value: averages.tasteSmell },
    { name: 'Ease of Mixing', value: averages.easeOfMixing },
    { name: 'Feeding Experience', value: averages.feedingExperience },
    { name: 'Convenience', value: averages.convenience },
    { name: 'Overall Quality', value: averages.overallQuality },
  ].map((d) => ({ ...d, value: d.value ?? 0, display: formatRating(d.value) }));

  return (
    <div className="card-surface p-5">
      <h3 className="font-display text-lg font-semibold text-ink-900">
        Product Experience
      </h3>
      <p className="mt-1 text-sm text-ink-400">
        Average ratings across six product questions (scale 0–5)
      </p>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 48 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4f0e9" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6f665b', fontSize: 11 }}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={60}
            />
            <YAxis domain={[0, 5]} tick={{ fill: '#6f665b', fontSize: 12 }} />
            <Tooltip
              formatter={(value) => [
                typeof value === 'number' ? value.toFixed(1) : String(value ?? ''),
                'Average',
              ]}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #c5ddd0',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={48}>
              {data.map((_, i) => (
                <Cell key={data[i]!.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface ObservationChartProps {
  title: string;
  subtitle: string;
  data: DistributionItem[];
  variant: 'donut' | 'horizontal' | 'vertical';
  observationNote?: string;
}

export function ObservationChart({
  title,
  subtitle,
  data,
  variant,
  observationNote,
}: ObservationChartProps) {
  const chartData = data.filter((d) => d.count > 0);

  return (
    <div className="card-surface p-5">
      <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
      <p className="mt-1 text-sm text-ink-400">{subtitle}</p>
      {observationNote ? (
        <p className="mt-2 text-xs text-ink-400">{observationNote}</p>
      ) : null}

      {chartData.length === 0 ? (
        <p className="mt-8 text-center text-sm text-ink-400">No observations yet</p>
      ) : variant === 'donut' ? (
        <div className="mt-2 flex flex-col items-center gap-4 lg:flex-row">
          <div className="h-56 w-full max-w-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {chartData.map((entry, i) => (
                    <Cell
                      key={entry.label}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, _name, item) => {
                    const payload = item?.payload as DistributionItem | undefined;
                    return [
                      `${String(value ?? 0)} (${payload?.percentage ?? 0}%)`,
                      payload?.label ?? 'Count',
                    ];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="w-full space-y-2 text-sm">
            {chartData.map((item, i) => (
              <li key={item.label} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-ink-600">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  {item.label}
                </span>
                <span className="font-medium text-ink-800">
                  {item.count} · {item.percentage}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : variant === 'horizontal' ? (
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e4f0e9" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fill: '#6f665b', fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="label"
                width={150}
                tick={{ fill: '#6f665b', fontSize: 11 }}
              />
              <Tooltip
                formatter={(value, _n, item) => {
                  const payload = item?.payload as DistributionItem | undefined;
                  return [
                    `${String(value ?? 0)} (${payload?.percentage ?? 0}%)`,
                    'Responses',
                  ];
                }}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={28}>
                {chartData.map((entry, i) => (
                  <Cell key={entry.label} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 56 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4f0e9" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#6f665b', fontSize: 11 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={70}
              />
              <YAxis allowDecimals={false} tick={{ fill: '#6f665b', fontSize: 12 }} />
              <Tooltip
                formatter={(value, _n, item) => {
                  const payload = item?.payload as DistributionItem | undefined;
                  return [
                    `${String(value ?? 0)} (${payload?.percentage ?? 0}%)`,
                    'Responses',
                  ];
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={48}>
                {chartData.map((entry, i) => (
                  <Cell key={entry.label} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
