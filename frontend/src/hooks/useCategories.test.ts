import { describe, expect, it } from "vitest";

import {
	buildCategoryItemCountMap,
	selectMostUsedCategory,
} from "./useCategories";

describe("useCategories helpers", () => {
	it("groups transaction counts by category name", () => {
		const counts = buildCategoryItemCountMap([
			{ category: "Mercado" },
			{ category: "Saúde" },
			{ category: "Mercado" },
		]);

		expect(counts.get("Mercado")).toBe(2);
		expect(counts.get("Saúde")).toBe(1);
		expect(counts.get("Carro")).toBeUndefined();
	});

	it("returns null when every category has zero items", () => {
		const mostUsed = selectMostUsedCategory([
			{
				id: "1",
				name: "Mercado",
				description: "",
				color: "orange",
				icon: "cart",
				itemCount: 0,
			},
			{
				id: "2",
				name: "Saúde",
				description: "",
				color: "red",
				icon: "dumbbell",
				itemCount: 0,
			},
		]);

		expect(mostUsed).toBeNull();
	});

	it("returns category with highest item count", () => {
		const mostUsed = selectMostUsedCategory([
			{
				id: "1",
				name: "Mercado",
				description: "",
				color: "orange",
				icon: "cart",
				itemCount: 2,
			},
			{
				id: "2",
				name: "Saúde",
				description: "",
				color: "red",
				icon: "dumbbell",
				itemCount: 3,
			},
		]);

		expect(mostUsed?.name).toBe("Saúde");
	});
});
