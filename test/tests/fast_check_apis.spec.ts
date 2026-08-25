import { test, expect } from "@playwright/test";

const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:3001";
const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

type ApiEntity = {
  _id: string;
  slug: string;
};

test.describe.serial("API smoke tests", () => {
  let category: ApiEntity;
  let product: ApiEntity;

  test("GET categories returns a list", async ({ request }) => {
    const response = await request.get(`${apiBaseUrl}/categories`);

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(expect.any(Array));
  });

  test("category CRUD and slug generation work", async ({ request }) => {
    const createResponse = await request.post(`${apiBaseUrl}/categories`, {
      data: {
        name: `Đồ uống kiểm tra ${runId}`,
        description: "Category created by Playwright API tests",
      },
    });

    expect(createResponse.status()).toBe(201);
    const created = await createResponse.json();
    category = created;

    expect(created._id).toEqual(expect.any(String));
    expect(created.slug).toContain("do-uong-kiem-tra");

    const getResponse = await request.get(
      `${apiBaseUrl}/categories/${created._id}`,
    );
    expect(getResponse.status()).toBe(200);
    expect((await getResponse.json())._id).toBe(created._id);

    const updateResponse = await request.patch(
      `${apiBaseUrl}/categories/${created._id}`,
      { data: { name: `Đồ uống đã sửa ${runId}` } },
    );
    expect(updateResponse.status()).toBe(200);
    const updated = await updateResponse.json();
    expect(updated.name).toBe(`Đồ uống đã sửa ${runId}`);
    expect(updated.slug).toContain("do-uong-da-sua");
  });

  test("product CRUD and validation work", async ({ request }) => {
    const invalidResponse = await request.post(`${apiBaseUrl}/products`, {
      data: { item_name: "" },
    });
    expect(invalidResponse.status()).toBe(400);

    const createResponse = await request.post(`${apiBaseUrl}/products`, {
      data: {
        item_name: `Sản phẩm kiểm tra ${runId}`,
        category_id: category._id,
        images: ["https://example.com/test-product.jpg"],
        price: 25000,
        quantity: 10,
        description: "Product created by Playwright API tests",
        rating: 4,
        discount: 5,
      },
    });

    expect(createResponse.status()).toBe(201);
    const created = await createResponse.json();
    product = created;

    expect(created._id).toEqual(expect.any(String));
    expect(created.slug).toContain("san-pham-kiem-tra");

    const listResponse = await request.get(`${apiBaseUrl}/products`);
    expect(listResponse.status()).toBe(200);
    expect(
      (await listResponse.json()).some(
        (item: ApiEntity) => item._id === created._id,
      ),
    ).toBe(true);

    const getResponse = await request.get(
      `${apiBaseUrl}/products/${created._id}`,
    );
    expect(getResponse.status()).toBe(200);

    const updateResponse = await request.patch(
      `${apiBaseUrl}/products/${created._id}`,
      { data: { price: 30000, quantity: 8 } },
    );
    expect(updateResponse.status()).toBe(200);
    expect(await updateResponse.json()).toMatchObject({
      price: 30000,
      quantity: 8,
    });
  });

  test("DELETE product soft-deletes it and hides it from GET", async ({
    request,
  }) => {
    const deleteResponse = await request.delete(
      `${apiBaseUrl}/products/${product._id}`,
    );
    expect(deleteResponse.status()).toBe(200);
    expect((await deleteResponse.json()).isDeleted).toBe(true);

    const getResponse = await request.get(
      `${apiBaseUrl}/products/${product._id}`,
    );
    expect(getResponse.status()).toBe(404);

    const listResponse = await request.get(`${apiBaseUrl}/products`);
    expect(
      (await listResponse.json()).some(
        (item: ApiEntity) => item._id === product._id,
      ),
    ).toBe(false);
  });

  test("DELETE category soft-deletes it and hides it from GET", async ({
    request,
  }) => {
    const deleteResponse = await request.delete(
      `${apiBaseUrl}/categories/${category._id}`,
    );
    expect(deleteResponse.status()).toBe(200);
    expect((await deleteResponse.json()).message).toContain("xóa danh mục");

    const getResponse = await request.get(
      `${apiBaseUrl}/categories/${category._id}`,
    );
    expect(getResponse.status()).toBe(404);

    const listResponse = await request.get(`${apiBaseUrl}/categories`);
    expect(
      (await listResponse.json()).some(
        (item: ApiEntity) => item._id === category._id,
      ),
    ).toBe(false);
  });
});
