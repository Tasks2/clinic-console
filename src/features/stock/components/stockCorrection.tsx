import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateProductStock } from '../stockApi'
import type { Product } from '../stockApi'

const stockCorrectionSchema = z.object({
  stock: z
    .number({
      error: 'Stock count is required',
    })
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),
})

type StockCorrectionForm = z.infer<
  typeof stockCorrectionSchema
>

interface StockCorrectionProps {
  product: Product
}

export function StockCorrection({
  product,
}: StockCorrectionProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StockCorrectionForm>({
    resolver: zodResolver(stockCorrectionSchema),
    defaultValues: {
      stock: product.stock,
    },
  })

  const mutation = useMutation({
    mutationFn: (stock: number) =>
      updateProductStock(product.id, { stock }),

    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(
        ['stock-product', String(product.id)],
        updatedProduct,
      )

      queryClient.invalidateQueries({
        queryKey: ['stock'],
      })

      reset({
        stock: updatedProduct.stock,
      })
    },
  })

  function onSubmit(data: StockCorrectionForm) {
    mutation.mutate(data.stock)
  }

  return (
    <section className="rounded-lg border p-6">
      <h2 className="text-lg font-semibold">
        Correct stock
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 space-y-4"
      >
        <div>
          <label
            htmlFor="stock"
            className="mb-1 block text-sm font-medium"
          >
            Stock count
          </label>

          <input
            id="stock"
            type="number"
            min="0"
            step="1"
            {...register('stock', {
              valueAsNumber: true,
            })}
            aria-invalid={Boolean(errors.stock)}
            aria-describedby={
              errors.stock ? 'stock-error' : undefined
            }
            className="w-full rounded-md border px-3 py-2"
          />

          {errors.stock && (
            <p
              id="stock-error"
              role="alert"
              className="mt-1 text-sm"
            >
              {errors.stock.message}
            </p>
          )}
        </div>

        {mutation.isSuccess && (
          <p role="status" className="text-sm">
            Stock updated successfully.
          </p>
        )}

        {mutation.isError && (
          <p role="alert" className="text-sm">
            Unable to update stock. Please try again.
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mutation.isPending ? 'Saving...' : 'Save correction'}
        </button>
      </form>
    </section>
  )
}