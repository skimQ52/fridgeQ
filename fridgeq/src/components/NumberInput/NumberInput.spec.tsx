import React, {createRef} from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import NumberInput from "./NumberInput";

describe("NumberInput component", () => {

    let quanRef = createRef<HTMLInputElement>();

    it("renders with provided label and placeholder", () => {
        render(<NumberInput label="Quantity" refer={quanRef} placeholder="taco potato"/>);
        screen.getByLabelText("Quantity");
        screen.getByPlaceholderText("taco potato");
    });

    it("updates value correctly", async () => {
        render(<NumberInput label="Quantity" refer={quanRef} placeholder="taco potato"/>);
        const input = screen.getByPlaceholderText("taco potato");
        fireEvent.change(input, {target: {value: "25"}});
        expect(quanRef.current?.value).toBe("25")
    });
});