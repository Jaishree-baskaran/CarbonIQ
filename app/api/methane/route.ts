import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.CARBON_MAPPER_API_KEY || "";
    
    // Fetch data from the live API
    const res = await fetch('https://api.carbonmapper.org/api/v1/catalog/plumes?limit=50', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, error: "Carbon Mapper API key is invalid or missing" }, { status: res.status || 401 });
    }

    const json = await res.json();
    
    // Filter for India bounds
    const indiaData = (json.data || json).filter((item: any) => {
        const lat = item.latitude || 0;
        const lon = item.longitude || 0;
        return (lat >= 8.4 && lat <= 37.6 && lon >= 68.7 && lon <= 97.2);
    });

    return NextResponse.json({ success: true, data: indiaData });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
