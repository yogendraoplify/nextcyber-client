import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useForm, FormProvider } from "react-hook-form";
import SelectField from "@/components/SelectField";

const options = [
  { label: "React", value: "react" },
  { label: "Node", value: "node" },
  { label: "Vue", value: "vue" },
];

const renderWithForm = (ui, defaultValues = {}) => {
  const Wrapper = ({ children }) => {
    const methods = useForm({ defaultValues });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  return render(ui, { wrapper: Wrapper });
};

describe("SelectField – Standalone mode", () => {
  test("renders placeholder", () => {
    render(
      <SelectField
        label="Skills"
        options={options}
        placeholder="Select skill"
      />,
    );

    expect(screen.getByText("Select skill")).toBeInTheDocument();
  });

  test("opens dropdown and selects single value", () => {
    const onChange = jest.fn();

    render(
      <SelectField label="Skills" options={options} onChange={onChange} />,
    );

    fireEvent.click(screen.getByText("Select an option"));
    fireEvent.click(screen.getByText("React"));

    expect(onChange).toHaveBeenCalledWith("react");
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  test("supports multiple selection", () => {
    const onChange = jest.fn();

    render(
      <SelectField
        label="Skills"
        options={options}
        multiple
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByText("Select an option"));
    fireEvent.click(screen.getByText("React"));
    fireEvent.click(screen.getByText("Node"));

    expect(onChange).toHaveBeenLastCalledWith(["react", "node"]);
    expect(screen.getByText("2 selected")).toBeInTheDocument();
  });

  test("filters options using search", () => {
    render(<SelectField label="Skills" options={options} isSearch />);

    fireEvent.click(screen.getByText("Select an option"));

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "re" } });

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.queryByText("Node")).not.toBeInTheDocument();
  });

  test("shows 'No results found' when search has no match", () => {
    render(<SelectField label="Skills" options={options} />);

    fireEvent.click(screen.getByText("Select an option"));
    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "angular" },
    });

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  test("renders error message in standalone mode", () => {
    render(
      <SelectField
        label="Skills"
        options={options}
        error="This field is required"
      />,
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });
});

describe("SelectField – React Hook Form mode", () => {
  test("renders RHF controlled field", () => {
    renderWithForm(
      <SelectField name="skills" label="Skills" options={options} />,
    );

    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  test("updates RHF value on selection", () => {
    renderWithForm(
      <SelectField name="skills" label="Skills" options={options} />,
      { skills: "" },
    );

    fireEvent.click(screen.getByText("Select an option"));
    fireEvent.click(screen.getByText("Vue"));

    expect(screen.getByText("Vue")).toBeInTheDocument();
  });

  test("supports multiple selection with RHF", () => {
    renderWithForm(
      <SelectField name="skills" label="Skills" options={options} multiple />,
      { skills: [] },
    );

    fireEvent.click(screen.getByText("Select an option"));
    fireEvent.click(screen.getByText("React"));
    fireEvent.click(screen.getByText("Node"));

    expect(screen.getByText("2 selected")).toBeInTheDocument();
  });

  test("displays RHF validation error", async () => {
    const Wrapper = ({ children }) => {
      const methods = useForm({
        defaultValues: { skills: "" },
        mode: "onSubmit",
      });

      return (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(() => {})}>
            {children}
            <button type="submit">Submit</button>
          </form>
        </FormProvider>
      );
    };

    render(
      <SelectField
        name="skills"
        label="Skills"
        options={options}
        rules={{ required: "Skill is required" }}
      />,
      { wrapper: Wrapper },
    );

    fireEvent.click(screen.getByText("Submit"));

    expect(await screen.findByText("Skill is required")).toBeInTheDocument();
  });

  test("clears search input using X icon", () => {
    renderWithForm(
      <SelectField name="skills" label="Skills" options={options} />,
    );

    fireEvent.click(screen.getByText("Select an option"));

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "re" } });

    fireEvent.click(screen.getByLabelText("Clear search"));

    expect(searchInput).toHaveValue("");
  });
});
