import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Modal from "@/components/modal/Modal";

describe("Modal component", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      isOpen: true,
      onClose: jest.fn(),
      title: "Test Modal",
      children: <p>Modal Content</p>,
    };

    return {
      onClose: defaultProps.onClose,
      ...render(<Modal {...defaultProps} {...props} />),
    };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

test("does not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={jest.fn()} title="Hidden">
        Content
      </Modal>
    );

    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

test("renders title and children when open", () => {
    setup();

    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });



test("does NOT call onClose when clicking inside the modal content", () => {
    const { onClose } = setup();

    fireEvent.click(screen.getByText("Modal Content"));

    expect(onClose).not.toHaveBeenCalled();
  });

test("calls onClose when clicking the close button", () => {
    const { onClose } = setup();

    fireEvent.click(screen.getByRole("button"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

test("calls onClose when Escape key is pressed", () => {
    const { onClose } = setup();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

test("does not attach Escape listener when modal is closed", () => {
    const onClose = jest.fn();

    render(
      <Modal isOpen={false} onClose={onClose} title="Closed">
        Content
      </Modal>
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).not.toHaveBeenCalled();
  });
});