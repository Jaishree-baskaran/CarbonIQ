import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, amount, sector } = body;

    const apiKey = process.env.CARBON_INTERFACE_API_KEY;
    if (!apiKey || apiKey.includes("your_carbon_interface_key")) {
      // Fall back to mock industry calculations if key is not configured yet
      return NextResponse.json({
        success: true,
        co2_kg: Math.round(amount * (type === "electricity" ? 0.82 : 2.5)),
        source: "Fallback Standard Emissions Baseline"
      });
    }

    // Call Carbon Interface API
    let payload: any = {};
    if (type === "electricity") {
      payload = {
        type: "electricity",
        electricity_unit: "kwh",
        electricity_value: Number(amount),
        country: "in"
      };
    } else {
      // Fuel Combustion endpoint
      payload = {
        type: "fuel_combustion",
        fuel_source_type: sector === "diesel" ? "dfo" : sector === "natural_gas" ? "gas" : "coal",
        fuel_source_unit: "t",
        fuel_source_value: Number(amount)
      };
    }

    const response = await fetch("https://www.carboninterface.com/api/v1/estimates", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Carbon Interface API error: ${errText}`);
    }

    const result = await response.json();
    return NextResponse.json({
      success: true,
      co2_kg: Math.round(result.data?.attributes?.carbon_kg || 0),
      source: "Carbon Interface API Verified Estimate"
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
