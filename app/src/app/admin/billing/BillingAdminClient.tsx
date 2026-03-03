"use client";

import { useState } from "react";

type PriceConfig = {
  id: string;
  planCode: string;
  billingInterval: string;
  amountCents: number;
};

type DiscountCode = {
  id: string;
  code: string;
  type: string;
  value: number;
  validFrom: string;
  validTo: string | null;
  maxRedemptions: number | null;
  redemptionCount: number;
};

type Props = {
  initialPrices: PriceConfig[];
  initialDiscounts: DiscountCode[];
  initialConfig: Record<string, string>;
};

export function BillingAdminClient({
  initialPrices,
  initialDiscounts,
  initialConfig,
}: Props) {
  const [prices, setPrices] = useState(initialPrices);
  const [discounts, setDiscounts] = useState(initialDiscounts);
  const [config, setConfig] = useState(initialConfig);
  const [priceSaving, setPriceSaving] = useState<string | null>(null);
  const [configSaving, setConfigSaving] = useState<string | null>(null);
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<"percent" | "fixed_cents">("percent");
  const [newValue, setNewValue] = useState("");
  const [discountCreating, setDiscountCreating] = useState(false);

  async function savePrice(planCode: string, billingInterval: string, amountCents: number) {
    const key = `${planCode}-${billingInterval}`;
    setPriceSaving(key);
    try {
      const res = await fetch("/api/admin/billing/prices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planCode, billingInterval, amountCents }),
      });
      const data = await res.json();
      if (data.success && data.price) {
        setPrices((prev) =>
          prev.map((p) =>
            p.planCode === planCode && p.billingInterval === billingInterval
              ? { ...p, amountCents: data.price.amountCents }
              : p,
          ),
        );
      }
    } finally {
      setPriceSaving(null);
    }
  }

  async function saveConfig(key: string, value: string) {
    setConfigSaving(key);
    try {
      const res = await fetch("/api/admin/billing/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (data.success) {
        setConfig((prev) => ({ ...prev, [key]: value }));
      }
    } finally {
      setConfigSaving(null);
    }
  }

  async function createDiscount() {
    const value = parseInt(newValue, 10);
    if (!newCode.trim() || isNaN(value) || value < 0) return;
    setDiscountCreating(true);
    try {
      const res = await fetch("/api/admin/billing/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newCode.trim().toUpperCase(),
          type: newType,
          value,
        }),
      });
      const data = await res.json();
      if (data.success && data.discount) {
        setDiscounts((prev) => [data.discount, ...prev]);
        setNewCode("");
        setNewValue("");
      }
    } finally {
      setDiscountCreating(false);
    }
  }

  const configLabels: Record<string, string> = {
    annual_discount_percent: "Annual discount (%)",
    referral_discount_percent: "Referral discount (%)",
    post_trial_discount_percent: "Post-trial discount (%)",
    post_trial_discount_months: "Post-trial discount months",
  };

  return (
    <div className="mt-8 space-y-10">
      <section>
        <h2 className="text-lg font-semibold text-gray-900">Prices</h2>
        <p className="mt-1 text-sm text-gray-500">
          Monthly and annual prices per plan. Amount in cents (e.g. 4900 = $49).
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Plan</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Interval</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Amount (cents)</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {prices.map((p) => (
                <PriceRow
                  key={p.id}
                  price={p}
                  onSave={savePrice}
                  saving={priceSaving === `${p.planCode}-${p.billingInterval}`}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Config</h2>
        <p className="mt-1 text-sm text-gray-500">
          Global billing settings.
        </p>
        <div className="mt-4 space-y-3">
          {Object.entries(configLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-4">
              <label className="w-48 text-sm text-gray-700">{label}</label>
              <input
                type="text"
                defaultValue={config[key] ?? ""}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v && v !== config[key]) saveConfig(key, v);
                }}
                className="rounded border border-gray-300 px-3 py-1.5 text-sm"
              />
              {configSaving === key && (
                <span className="text-xs text-gray-500">Saving...</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Discount codes</h2>
        <p className="mt-1 text-sm text-gray-500">
          Promo codes for percent or fixed-cents discounts.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Code (e.g. LAUNCH10)"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm"
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as "percent" | "fixed_cents")}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm"
          >
            <option value="percent">Percent</option>
            <option value="fixed_cents">Fixed (cents)</option>
          </select>
          <input
            type="number"
            placeholder="Value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="w-24 rounded border border-gray-300 px-3 py-1.5 text-sm"
          />
          <button
            onClick={createDiscount}
            disabled={discountCreating || !newCode.trim() || !newValue}
            className="rounded bg-[#0d9488] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#0f766e] disabled:opacity-50"
          >
            {discountCreating ? "Creating..." : "Create"}
          </button>
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Code</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Value</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Redemptions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {discounts.map((d) => (
                <tr key={d.id}>
                  <td className="px-4 py-3 font-mono text-gray-900">{d.code}</td>
                  <td className="px-4 py-3 text-gray-700">{d.type}</td>
                  <td className="px-4 py-3 text-gray-700">{d.value}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {d.redemptionCount}
                    {d.maxRedemptions != null ? ` / ${d.maxRedemptions}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function PriceRow({
  price,
  onSave,
  saving,
}: {
  price: PriceConfig;
  onSave: (planCode: string, billingInterval: string, amountCents: number) => void;
  saving: boolean;
}) {
  const [value, setValue] = useState(String(price.amountCents));
  const [dirty, setDirty] = useState(false);

  const handleSave = () => {
    const n = parseInt(value, 10);
    if (!isNaN(n) && n >= 0) {
      onSave(price.planCode, price.billingInterval, n);
      setDirty(false);
    }
  };

  return (
    <tr>
      <td className="px-4 py-3 font-medium text-gray-900">{price.planCode}</td>
      <td className="px-4 py-3 text-gray-700">{price.billingInterval}</td>
      <td className="px-4 py-3">
        <input
          type="number"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setDirty(true);
          }}
          className="w-24 rounded border border-gray-300 px-2 py-1 text-sm"
        />
      </td>
      <td className="px-4 py-3">
        {dirty && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-sm text-[#0d9488] hover:underline disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        )}
      </td>
    </tr>
  );
}
