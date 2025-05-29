import { Button } from "@ashgw/ui";

interface FormButtonsProps {
  onReset: () => void;
  isSubmitting?: boolean;
}

export function FormButtons({ onReset, isSubmitting }: FormButtonsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="squared:outline"
        type="button"
        onClick={onReset}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        variant="squared:default"
        type="submit"
        disabled={isSubmitting}
        loading={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
