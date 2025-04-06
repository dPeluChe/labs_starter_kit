import { NextRequest, NextResponse } from 'next/server';
import { getTableStructure } from './utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tableName = searchParams.get('table');
    
    console.log('Received request for table structure:', tableName);
    
    if (!tableName) {
      return NextResponse.json({
        success: false,
        error: 'Table name is required'
      }, { status: 400 });
    }
    
    const result = await getTableStructure(tableName);
    console.log('Table structure result:', result);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      columns: result.columns
    });
    
  } catch (error) {
    console.error('Error in get-table-structure API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}