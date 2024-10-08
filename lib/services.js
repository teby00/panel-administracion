import { cookies } from 'next/headers';
import { ALL_AREAS_VENTAS } from '@/lib/querys';

export async function fecthBase(
  query,
  variables,
  contentType = 'application/json'
) {
  const token = cookies().get('session')?.value;
  try {
    const results = await fetch(process.env.BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }).then((res) => res.json());
    return results;
  } catch (e) {
    return {
      errors: [{ message: e.message }],
    };
  }
}

export async function getUsuarios() {
  const token = cookies().get('session')?.value;
  try {
    const res = await fetch(process.env.BACKEND_URL_V2 + '/usuarios/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      if (res.status === 401)
        return { data: null, error: 'Credenciales inválidas' };
      return { data: null, error: 'Algo salió mal.' };
    }
    const data = await res.json();
    return {
      error: null,
      data,
    };
  } catch (e) {
    return {
      data: null,
      error: 'No se pudo conectar con el servidor.',
    };
  }
}

export async function getProductos(id, is_revoltosa, is_almacen) {
  const token = cookies().get('session')?.value;
  let queryParams = id ? `?a=${id}` : '';
  if (is_revoltosa) {
    queryParams += queryParams ? '&' : '?';
    queryParams += 'is_revoltosa=true';
  }
  if (is_almacen) {
    queryParams += queryParams ? '&' : '?';
    queryParams += 'is_almacen=true';
  }

  try {
    const res = await fetch(
      process.env.BACKEND_URL_V2 + '/productos' + queryParams,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      if (res.status === 401)
        return { data: null, error: 'Credenciales inválidas' };
      return { data: null, error: 'Algo salió mal.' };
    }
    const data = await res.json();
    return {
      error: null,
      data,
    };
  } catch (e) {
    return {
      data: null,
      error: 'Error al conectar con el servidor.',
    };
  }
}

export async function getEntradas() {
  const token = cookies().get('session')?.value;
  try {
    const res = await fetch(process.env.BACKEND_URL_V2 + '/entradas/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      if (res.status === 401)
        return { data: null, error: 'Credenciales inválidas' };
      return { data: null, error: 'Algo salió mal.' };
    }
    const data = await res.json();
    return {
      error: null,
      data,
    };
  } catch (e) {
    return {
      data: null,
      error: 'Error al conectar con el servidor.',
    };
  }
}

export async function getSalidas() {
  const token = cookies().get('session')?.value;
  try {
    const res = await fetch(process.env.BACKEND_URL_V2 + '/salidas/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      if (res.status === 401)
        return { data: null, error: 'Credenciales inválidas' };
      return { data: null, error: 'Algo salió mal.' };
    }
    const data = await res.json();
    return {
      error: null,
      data,
    };
  } catch (e) {
    return {
      data: null,
      error: 'Error al conectar con el servidor.',
    };
  }
}

export async function getSalidasRevoltosa() {
  const token = cookies().get('session')?.value;
  try {
    const res = await fetch(
      process.env.BACKEND_URL_V2 + '/salidas-revoltosa/',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: {
          tags: ['salidas-revoltosa'],
        },
      }
    );
    if (!res.ok) {
      if (res.status === 401)
        return { data: null, error: 'Credenciales inválidas' };
      return { data: null, error: 'Algo salió mal.' };
    }
    const data = await res.json();
    return {
      error: null,
      data,
    };
  } catch (e) {
    return {
      data: null,
      error: 'Error al conectar con el servidor.',
    };
  }
}

export async function getAreasVentas(variables) {
  const result = await fecthBase(ALL_AREAS_VENTAS, variables);
  return {
    errors: result?.errors || null,
    data: result?.data?.allAreaVenta || null,
  };
}

export async function getArea(id) {
  const token = cookies().get('session')?.value;
  try {
    const res = await fetch(
      process.env.BACKEND_URL_V2 + '/areas-ventas/' + id + '/',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      if (res.status === 401)
        return { data: null, error: 'Credenciales inválidas' };
      return { data: null, error: 'Algo salió mal.' };
    }
    const data = await res.json();
    return {
      error: null,
      data,
    };
  } catch (e) {
    return {
      data: null,
      error: 'Error al conectar con el servidor.',
    };
  }
}

export async function inventarioAlmacen() {
  const token = cookies().get('session')?.value;
  try {
    const res = await fetch(
      process.env.BACKEND_URL_V2 + '/inventario/almacen/',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      if (res.status === 401)
        return { data: null, error: 'Credenciales inválidas' };
      return { data: null, error: 'Algo salió mal.' };
    }
    const data = await res.json();
    return {
      error: null,
      data,
    };
  } catch (e) {
    return {
      data: null,
      error: 'Error al conectar con el servidor.',
    };
  }
}

export async function inventarioAreaVenta({ id }) {
  const token = cookies().get('session')?.value;
  try {
    const res = await fetch(
      process.env.BACKEND_URL_V2 + '/inventario/area-venta/' + id + '/',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      if (res.status === 401)
        return { data: null, error: 'Credenciales inválidas' };
      return { data: null, error: 'Algo salió mal.' };
    }
    const data = await res.json();
    return {
      error: null,
      data,
    };
  } catch (e) {
    return {
      data: null,
      error: 'Error al conectar con el servidor.',
    };
  }
}

export async function inventarioAlmacenRevoltosa() {
  const token = cookies().get('session')?.value;
  try {
    const res = await fetch(
      process.env.BACKEND_URL_V2 + '/inventario/almacen-revoltosa/',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      if (res.status === 401)
        return { data: null, error: 'Credenciales inválidas' };
      return { data: null, error: 'Algo salió mal.' };
    }
    const data = await res.json();
    return {
      error: null,
      data,
    };
  } catch (e) {
    return {
      data: null,
      error: 'Error al conectar con el servidor.',
    };
  }
}

export async function getVenta(id) {
  const token = cookies().get('session')?.value;
  try {
    const res = await fetch(
      process.env.BACKEND_URL_V2 + '/ventas/' + id + '/',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      if (res.status === 401)
        return { data: null, error: 'Credenciales inválidas' };
      return { data: null, error: 'Algo salió mal.' };
    }
    const data = await res.json();
    return {
      error: null,
      data,
    };
  } catch (e) {
    return {
      data: null,
      error: 'Error al conectar con el servidor.',
    };
  }
}

export async function searchProduct(codigo) {
  const token = cookies().get('session')?.value;
  try {
    const res = await fetch(
      process.env.BACKEND_URL_V2 + '/search/' + codigo + '/',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      if (res.status === 401)
        return { data: null, error: 'Credenciales inválidas' };
      return { data: null, error: 'Algo salió mal.' };
    }
    const data = await res.json();
    return {
      error: null,
      data,
    };
  } catch (e) {
    return {
      data: null,
      error: 'Error al conectar con el servidor.',
    };
  }
}

export async function getCategorias() {
  const token = cookies().get('session')?.value;
  try {
    const res = await fetch(process.env.BACKEND_URL_V2 + '/categorias/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      if (res.status === 401)
        return { data: null, error: 'Credenciales inválidas' };
      return { data: null, error: 'Algo salió mal.' };
    }
    const data = await res.json();
    return {
      error: null,
      data,
    };
  } catch (e) {
    return {
      data: null,
      error: 'Error al conectar con el servidor.',
    };
  }
}

export async function graficas() {
  const token = cookies().get('session')?.value;
  try {
    const res = await fetch(process.env.BACKEND_URL_V2 + '/graficas/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      if (res.status === 401)
        return { data: null, error: 'Credenciales inválidas' };
      return { data: null, error: 'Algo salió mal.' };
    }
    const data = await res.json();
    return {
      error: null,
      data,
    };
  } catch (e) {
    return {
      data: null,
      error: 'Error al conectar con el servidor.',
    };
  }
}

export async function getReporte(params) {
  if (!params.desde || !params.hasta)
    return {
      data: null,
      error: null,
    };
  const token = cookies().get('session')?.value;
  const baseUrl = process.env.BACKEND_URL_V2 + '/reportes/';
  const url = new URL(baseUrl);
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      if (res.status === 401)
        return { data: null, error: 'Credenciales inválidas' };
      return { data: null, error: 'Algo salió mal.' };
    }
    const data = await res.json();
    return {
      error: null,
      data,
    };
  } catch (e) {
    return {
      data: null,
      error: 'Error al conectar con el servidor.',
    };
  }
}
