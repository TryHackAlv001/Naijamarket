import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ProductForm() {
  return (
    <form className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <Input placeholder="Product name" />
      <Input placeholder="Price" type="number" />
      <Button type="submit">Save product</Button>
    </form>
  );
}
