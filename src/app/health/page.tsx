interface StatusResponse {
  timestamp: string;
  status: string;
  environment: string;
}

async function getHealthData(): Promise<StatusResponse> {
  return {
    timestamp: new Date().toISOString(),
    status: "HEALTHY",
    environment: process.env.NODE_ENV || "development",
  };
}

export default async function HealthPage() {
  const data = await getHealthData();

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">System Health & Diagnostics</h2>
        <p className="text-slate-400 text-sm">Server-side fetched runtime diagnostic data.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg space-y-3 font-mono text-sm">
        <div className="flex justify-between border-b border-slate-800 pb-2">
          <span className="text-slate-400">Status:</span>
          <span className="text-emerald-400 font-bold">{data.status}</span>
        </div>
        <div className="flex justify-between border-b border-slate-800 pb-2">
          <span className="text-slate-400">Environment:</span>
          <span className="text-sky-400">{data.environment}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Checked At:</span>
          <span className="text-slate-300">{data.timestamp}</span>
        </div>
      </div>
    </section>
  );
}