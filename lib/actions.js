'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
  LOGIN,
  DELETE_AREA_VENTA,
  ADD_AREA_VENTA,
  UPDATE_AREA_VENTA,
} from '@/lib/mutations';
import { fecthBase } from '@/lib/services';

export async function login(data) {
  const result = await fecthBase(LOGIN, data);

  if (result.errors) return { errors: result.errors };

  cookies().set('session', result.data.login.token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  redirect('/');
}

export async function createProduct(formData) {
  const token = cookies().get('session')?.value || null;
  const results = await fetch(process.env.BACKEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `JWT ${token}`,
    },
    body: formData,
  }).then((res) => res.json());
  revalidatePath('/products');
  return { errors: results.errors || null, data: results.data.addProductoInfo };
}

export async function editProduct(formData) {
  const token = cookies().get('session')?.value || null;
  const results = await fetch(process.env.BACKEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `JWT ${token}`,
    },
    body: formData,
  }).then((res) => res.json());

  revalidatePath('/products');
  return {
    errors: results?.errors || null,
    data: results?.data?.updateProductoInfo,
  };
}

export async function createAreaVenta(data) {
  const result = await fecthBase(ADD_AREA_VENTA, data);

  if (result.data) revalidatePath('/areas-de-ventas');
  return { errors: result.errors || null, data: result.data };
}

export async function editAreaVenta(data) {
  const result = await fecthBase(UPDATE_AREA_VENTA, data);
  if (result.data) revalidatePath('/areas-de-ventas');
  return {
    errors: result.errors || null,
    data: result.data,
  };
}

export async function deleteAreaVenta({ id }) {
  const result = await fecthBase(DELETE_AREA_VENTA, { id });

  revalidatePath('/areas-de-ventas');
  return {
    errors: result.errors || null,
    data: result.data.deleteAreaVenta.message || null,
  };
}

export async function addVenta(data) {
  const token = cookies().get('session')?.value || null;
  const res = await fetch(process.env.BACKEND_URL_V2 + '/ventas/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...data }),
  });
  if (!res.ok) {
    if (res.status === 401)
      return {
        data: null,
        error: {
          message: 'No autorizado',
          description: 'Usted no está autorizado para esta acción',
        },
      };

    if (res.status === 400) {
      const json = await res.json();
      return {
        data: null,
        error: {
          message: json.detail,
        },
      };
    }

    const json = await res.json();

    return {
      data: null,
      error: {
        message: 'Algo salió mal.',
        description: 'Por favor contacte con soporte',
      },
    };
  }
  revalidatePath('/ventas');
  const response = await res.json();
  return {
    error: null,
    data: response,
  };
}

export async function logout() {
  cookies().delete('session');
  redirect('/login');
}
