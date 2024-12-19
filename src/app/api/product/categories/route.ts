import { createConnection } from '@/lib/db/dbConnect';
import { NextResponse } from 'next/server';

// Define types for categories, services, and options
type Option = {
  id: number;
  name: string;
  time: string;
  price: number;
};

type Service = {
  id: number;
  name: string;
  time: string;
  price: number;
  option: boolean;
  options: Option[];
};

type Category = {
  id: number;
  name: string;
  items: Service[];
};

export async function GET() {
  try {
    const db = await createConnection();

    // Fetch data using a single query
    const [categories]: any[] = await db.query(`
      SELECT 
        c.id AS categoryId, c.name AS categoryName, 
        s.id AS serviceId, s.name AS serviceName, s.time, s.price, s.option,
        o.id AS optionId, o.name AS optionName, o.time AS optionTime, o.price AS optionPrice
      FROM categories c
      LEFT JOIN services s ON c.id = s.category_id
      LEFT JOIN options o ON s.id = o.service_id
    `);

    // Transform the raw data into the desired nested structure
    const result: Category[] = categories.reduce((acc: Category[], row: any) => {
      // Check if the category already exists
      let category = acc.find((c) => c.id === row.categoryId);
      if (!category) {
        category = {
          id: row.categoryId,
          name: row.categoryName,
          items: [],
        };
        acc.push(category);
      }

      // Check if the service already exists in the category
      let service = category.items.find((s) => s.id === row.serviceId);
      if (!service) {
        service = {
          id: row.serviceId,
          name: row.serviceName,
          time: row.time,
          price: row.price,
          option: Boolean(row.option),
          options: [],
        };
        category.items.push(service);
      }

      // Add the option to the service if it exists
      if (row.optionId) {
        service.options.push({
          id: row.optionId,
          name: row.optionName,
          time: row.optionTime,
          price: row.optionPrice,
        });
      }

      return acc;
    }, []);

    // Return the transformed data
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
