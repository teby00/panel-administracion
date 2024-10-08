import { columns } from '@/app/(with-layout)/inventario/columns';
import { columns as columnsNew } from '@/app/(with-layout)/areas-de-venta/[id]/columns';
import { DataTable } from '@/components/ui/data-table-inventario-almacen';
import { DataTable as DataTableNew } from '@/components/ui/data-table-inventario-almacen-2';
import { CloudOff } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DownloadButton } from '@/components/functionals/DownloadButton';
import { Categoria } from '@/app/(with-layout)/categorias/types';

export interface Productos {
  id: number;
  codigo: string;
  descripcion: string;
  precio_venta: number;
  cantidad: number;
  categoria__nombre: string;
}

interface Data {
  productos: Productos[];
  zapatos: Productos[];
  categorias: Categoria[];
}

export default async function InventarioAreaVenta({
  data,
  area,
  all_productos,
}: {
  data: Data;
  area: string;
  all_productos: any;
}) {
  const productos = data?.productos;
  const zapatos = data?.zapatos;
  return (
    <main className="flex flex-1 flex-col gap-4 pb-4 lg:gap-6 lg:pb-6 h-full">
      <div className="flex justify-between items-center px-4">
        <h1 className="text-lg font-semibold md:text-2xl">Inventario</h1>
        <DownloadButton
          fileName={`inventario-${area}.pdf`}
          data={{ ...data, area_venta: area }}
        />
      </div>

      {productos && zapatos ? (
        <Tabs defaultValue="productos" className="h-full">
          <TabsList className="ml-4 bg-transparent p-0">
            <TabsTrigger
              className="h-full rounded-none data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-foreground border-b-[3px] border-white"
              value="productos"
            >
              Productos
            </TabsTrigger>
            <TabsTrigger
              className="h-full rounded-none data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-foreground border-b-[3px] border-white"
              value="zapatos"
            >
              Zapatos
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="productos"
            className="p-4 m-0 bg-muted/40 h-full border-t-2 border-muted"
          >
            <DataTableNew
              columns={columnsNew}
              data={productos}
              categorias={data?.categorias}
            />
          </TabsContent>
          <TabsContent
            value="zapatos"
            className="p-4 m-0 bg-muted/40 h-full border-t-2 border-muted"
          >
            <DataTable columns={columns} data={zapatos} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm mx-4 mb-16">
          <div className="flex flex-col items-center gap-1 text-center">
            <CloudOff size={72} className="inline-flex mb-4" />
            <h3 className="text-2xl font-bold tracking-tight">
              Error de conexión
            </h3>
            <p className="text-sm text-muted-foreground">
              Comprueba tu conexión a internet!, si el problema persiste
              contacta con soporte.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
