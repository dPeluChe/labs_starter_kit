import { NextRequest, NextResponse } from 'next/server';
import { ApiServiceProvider } from '@/lib/api/api-service-provider';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { modelName } = body;
    
    // Obtener el servicio Hasura
    const hasuraService = ApiServiceProvider.getHasuraService();
    
    // Si se especifica un modelo, sincronizar solo ese modelo
    if (modelName) {
      // Aquí implementaríamos la lógica para sincronizar un modelo específico
      // Por ejemplo, crear la tabla si no existe y rastrearla en Hasura
      
      // Ejemplo de creación de tabla para el modelo 'examples'
      if (modelName === 'examples') {
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS "examples" (
            "id" SERIAL PRIMARY KEY,
            "name" TEXT NOT NULL,
            "description" TEXT,
            "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `;
        
        await hasuraService.runSQL(createTableSQL);
        await hasuraService.trackTable('examples');
      }
      
      // Ejemplo para el modelo 'products'
      else if (modelName === 'products') {
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS "products" (
            "id" SERIAL PRIMARY KEY,
            "name" TEXT NOT NULL,
            "description" TEXT,
            "price" DECIMAL(10, 2) NOT NULL,
            "stock" INTEGER DEFAULT 0,
            "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `;
        
        await hasuraService.runSQL(createTableSQL);
        await hasuraService.trackTable('products');
      }
      
      // Ejemplo para el modelo 'categories'
      else if (modelName === 'categories') {
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS "categories" (
            "id" SERIAL PRIMARY KEY,
            "name" TEXT NOT NULL,
            "description" TEXT,
            "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `;
        
        await hasuraService.runSQL(createTableSQL);
        await hasuraService.trackTable('categories');
        
        // Crear relación entre productos y categorías si la tabla de productos existe
        const checkProductsTableSQL = `
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'products'
          );
        `;
        
        const result = await hasuraService.runSQL(checkProductsTableSQL);
        
        if (result.result[1][0]) {
          // Añadir columna category_id a la tabla products si no existe
          const addCategoryColumnSQL = `
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'products' 
                AND column_name = 'category_id'
              ) THEN
                ALTER TABLE "products" ADD COLUMN "category_id" INTEGER REFERENCES "categories"("id");
              END IF;
            END
            $$;
          `;
          
          await hasuraService.runSQL(addCategoryColumnSQL);
        }
      }
      
      return NextResponse.json({
        success: true,
        message: `Modelo "${modelName}" sincronizado correctamente`
      });
    }
    
    // Si no se especifica un modelo, sincronizar todos los modelos predefinidos
    else {
      // Sincronizar el modelo 'examples'
      const createExamplesTableSQL = `
        CREATE TABLE IF NOT EXISTS "examples" (
          "id" SERIAL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      await hasuraService.runSQL(createExamplesTableSQL);
      await hasuraService.trackTable('examples');
      
      // Sincronizar el modelo 'products'
      const createProductsTableSQL = `
        CREATE TABLE IF NOT EXISTS "products" (
          "id" SERIAL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "price" DECIMAL(10, 2) NOT NULL,
          "stock" INTEGER DEFAULT 0,
          "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      await hasuraService.runSQL(createProductsTableSQL);
      await hasuraService.trackTable('products');
      
      // Sincronizar el modelo 'categories'
      const createCategoriesTableSQL = `
        CREATE TABLE IF NOT EXISTS "categories" (
          "id" SERIAL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      await hasuraService.runSQL(createCategoriesTableSQL);
      await hasuraService.trackTable('categories');
      
      // Crear relación entre productos y categorías
      const addCategoryColumnSQL = `
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'products' 
            AND column_name = 'category_id'
          ) THEN
            ALTER TABLE "products" ADD COLUMN "category_id" INTEGER REFERENCES "categories"("id");
          END IF;
        END
        $$;
      `;
      
      await hasuraService.runSQL(addCategoryColumnSQL);
      
      return NextResponse.json({
        success: true,
        message: "Todos los modelos han sido sincronizados correctamente"
      });
    }
  } catch (error) {
    console.error('Failed to sync models:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}