'use client';

import { Button } from '@/components/ui/button';
import {
  DialogFooter,
  DialogClose,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckIcon, X, PlusCircle, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { SalidaRevoltosaSchema } from '@/lib/schemas';
import {
  safeParse,
  pipe,
  integer,
  minValue,
  string,
  transform,
  InferInput,
} from 'valibot';

import { addSalidaRevoltosa } from '@/app/(with-layout)/salidas-revoltosa/actions';
import { toast } from 'sonner';
import { CircleX, LoaderCircle } from 'lucide-react';
import { useRef, useState } from 'react';

import { Label } from '../ui/label';
import { Input } from '../ui/input';

import { ProductInfo } from '@/app/(with-layout)/products/types';

export default function ModalSalidaRevoltosa({
  trigger,
  productosInfo,
}: {
  trigger: React.ReactNode;
  productosInfo: ProductInfo[];
}) {
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const form = useForm({
    resolver: valibotResolver(SalidaRevoltosaSchema),
  });

  const { append, remove } = useFieldArray({
    control: form.control,
    name: 'zapatos_id',
  });

  const info_producto = useWatch({
    control: form.control,
    name: 'producto_info',
  });

  const IdArraySchema = pipe(
    string(),
    transform((input) => parseInt(input)),
    integer(),
    minValue(1)
  );

  const handleNewProducts = () => {
    const { success } = safeParse(IdArraySchema, ref.current?.value);
    if (ref.current) {
      success && append(ref.current.value);
      ref.current.value = '';
    }
  };

  const onSubmit = async (
    dataForm: InferInput<typeof SalidaRevoltosaSchema>
  ): Promise<void> => {
    setIsLoading(true);
    const { error } = await addSalidaRevoltosa(dataForm);
    setIsLoading(false);
    if (!error) {
      form.reset();
      setIsOpen(false);
      toast.success('La salida fué creada con éxito.');
    }
    setErrors(error);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn(
          'max-h-[605px]',
          form.getValues('zapatos_id')?.length > 5 && 'max-w-3xl'
        )}
      >
        <DialogHeader>
          <DialogTitle>Agregar Salida</DialogTitle>
        </DialogHeader>
        <DialogDescription>Todos los campos son requeridos</DialogDescription>
        {error && (
          <Alert variant="destructive">
            <CircleX className="h-5 w-5" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form
            // @ts-ignore
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn(
              form.getValues('zapatos_id')?.length > 5
                ? 'grid grid-cols-2 gap-4'
                : 'space-y-2'
            )}
          >
            <div>
              <FormField
                control={form.control}
                name="producto_info"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-2">
                    <Label>Producto</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? productosInfo?.find(
                                  (producto) => producto?.codigo === field.value
                                )?.codigo
                              : 'Selecciona un producto'}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[320px] p-0">
                        <Command className="rounded-lg border shadow-md">
                          <CommandInput placeholder="Escribe un código..." />
                          <CommandList>
                            <CommandEmpty>
                              Ningún resultado encontrado.
                            </CommandEmpty>
                            <CommandGroup heading="Sugerencias">
                              {productosInfo?.map((producto) => (
                                <CommandItem
                                  key={producto.id}
                                  value={producto.codigo}
                                  onSelect={(currentValue) => {
                                    const esZapato =
                                      productosInfo?.find(
                                        (e) => e.codigo === currentValue
                                      )?.categoria.nombre === 'Zapatos';

                                    if (esZapato) {
                                      form.setValue('cantidad', undefined);
                                      form.setValue('zapatos_id', []);
                                    } else {
                                      form.setValue('zapatos_id', undefined);
                                      form.setValue('cantidad', 0);
                                    }
                                    field.onChange(
                                      currentValue === field.value
                                        ? ''
                                        : currentValue
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  {producto.codigo}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      producto.codigo === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {info_producto &&
              productosInfo?.find((p) => p.codigo === info_producto)?.categoria
                ?.nombre === 'Zapatos' && (
                <div className="space-y-2">
                  <Label>Productos</Label>

                  {form.getValues('zapatos_id')?.length > 0 && (
                    <ul
                      className={cn(
                        'overflow-y-auto flex gap-2 p-2 max-h-[328px] flex-col items-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm bg-accent hover:text-accent-foreground rounded-md px-3 text-xs border-dashed ',
                        form?.formState?.errors?.productos &&
                          'border-destructive'
                      )}
                    >
                      {form
                        .getValues('zapatos_id')
                        ?.map((p: string, index: number) => (
                          <li
                            key={p}
                            className="flex w-full p-2 px-4 justify-between items-center bg-background rounded-md"
                          >
                            <span>{p}</span>
                            <X
                              className="ml-2 cursor-pointer"
                              onClick={() => remove(index)}
                              size={16}
                            />
                          </li>
                        ))}
                    </ul>
                  )}
                  <div className="flex gap-2">
                    <Input
                      ref={ref}
                      type="number"
                      placeholder="Introduzca Id"
                    />
                    <Button type="button" onClick={handleNewProducts}>
                      <PlusCircle className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {form.formState.errors?.productos?.message as string}
                  </p>
                </div>
              )}

            {info_producto &&
              productosInfo?.find((p) => p.codigo === info_producto)?.categoria
                ?.nombre !== 'Zapatos' && (
                <div className="space-y-2">
                  <Label>Cantidad</Label>
                  <Input
                    {...form.register('cantidad', { valueAsNumber: true })}
                    type="number"
                  />
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {form.formState.errors?.cantidad?.message as string}
                  </p>
                </div>
              )}

            <div className="col-span-2 grid gap-4">
              <DialogFooter className=" w-full flex gap-2 mt-2">
                <DialogClose asChild>
                  <Button type="button" className="w-full" variant="secondary">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Agregando...
                    </>
                  ) : (
                    'Agregar'
                  )}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
