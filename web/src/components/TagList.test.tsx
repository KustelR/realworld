//@vitest-environment jsdom

import React from "react";
import { describe, test } from "vitest";
import { render, screen } from "@testing-library/react";
import TagList from "./TagList";

describe("TagList component", () => {
  test("Creates tags when passed", async () => {
    render(<TagList tags={["tag 1"]} />);

    await screen.findByText("tag 1");
  });
});
