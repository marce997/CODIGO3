import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, UserPlus, Info, Zap, CreditCard, Banknote, DollarSign, ArrowUpDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  phone: string;
  address: string;
  additionalInfo: string;
}

const ExpenseDialog = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [isFutureExpense, setIsFutureExpense] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [installments, setInstallments] = useState<number>(1);
  const [installmentValue, setInstallmentValue] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [recurrenceType, setRecurrenceType] = useState<string>("");
  const [recurrenceDay, setRecurrenceDay] = useState<number>(1);
  const [recurrenceStartDate, setRecurrenceStartDate] = useState<string>("");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<string>("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: "1", name: "Fornecedor 1", cnpj: "", phone: "", address: "", additionalInfo: "" },
    { id: "2", name: "Fornecedor 2", cnpj: "", phone: "", address: "", additionalInfo: "" },
  ]);

  const [newSupplier, setNewSupplier] = useState<Omit<Supplier, "id">>({
    name: "",
    cnpj: "",
    phone: "",
    address: "",
    additionalInfo: "",
  });

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Calculate installment value whenever amount or installments change
  useEffect(() => {
    if (amount && installments > 0) {
      const numericAmount = parseFloat(amount.replace(/[^\d,]/g, "").replace(",", "."));
      if (!isNaN(numericAmount)) {
        const value = numericAmount / installments;
        setInstallmentValue(formatCurrency(String(value * 100)));
      }
    } else {
      setInstallmentValue("");
    }
  }, [amount, installments]);

  const handleAddSupplier = () => {
    if (newSupplier.name.trim()) {
      const newId = (suppliers.length + 1).toString();
      const supplierToAdd = {
        id: newId,
        ...newSupplier
      };
      setSuppliers([...suppliers, supplierToAdd]);
      setSelectedSupplier(newId);
      setNewSupplier({
        name: "",
        cnpj: "",
        phone: "",
        address: "",
        additionalInfo: "",
      });
      setIsPopoverOpen(false);
      toast.success("Fornecedor adicionado com sucesso!");
    }
  };

  const handleLaunch = () => {
    if (category === "fixed" && recurrenceType) {
      const message = `Despesa fixa programada com sucesso! 
        Recorrência: ${recurrenceType === "daily" ? "Diária" : 
                     recurrenceType === "weekly" ? "Semanal" : 
                     recurrenceType === "monthly" ? "Mensal" : "Anual"}
        Dia: ${recurrenceType === "weekly" ? 
          ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"][recurrenceDay] : 
          recurrenceDay}
        Início: ${new Date(recurrenceStartDate).toLocaleDateString()}
        Término: ${recurrenceEndDate ? new Date(recurrenceEndDate).toLocaleDateString() : "Indeterminado"}`;
      
      toast.success(message);
    } else {
      toast.success("Despesa lançada com sucesso!");
    }
  };

  const formatCurrency = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "");
    const numberFormat = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return numberFormat.format(Number(onlyNumbers) / 100);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setAmount(value ? formatCurrency(value) : "");
  };

  const handleInstallmentValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setInstallmentValue(value ? formatCurrency(value) : "");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="action-button glass-morphism relative group overflow-hidden rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all w-full"
          type="button"
        >
          <div className="absolute inset-0 expense-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center shadow-inner">
                <Minus className="w-10 h-10 text-red-600" />
              </div>
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-3xl font-medium text-gray-900 group-hover:text-white transition-colors mb-2">Despesa</h2>
              <p className="text-gray-500 group-hover:text-white/90 transition-colors">Registrar saída</p>
            </div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 bg-red-500 text-white p-8 rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold mb-4">Nova Despesa</DialogTitle>
              <p className="text-sm opacity-90">
                Registre suas saídas financeiras de forma simples e organizada
              </p>
            </DialogHeader>
            <div className="mt-8">
              <Card className="bg-[#FFEBEE] border-white/20 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 shrink-0 text-[#1A1F2C]" />
                  <div>
                    <p className="text-sm font-medium text-[#1A1F2C]">Dica</p>
                    <p className="text-xs text-[#1A1F2C] mt-1">
                      Para um melhor controle financeiro, selecione se é uma despesa atual ou futura e preencha todos os dados do fornecedor ao cadastrar um novo.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          <div className="w-full md:w-2/3 p-8">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-lg">
                <span className={`text-sm px-3 py-1 rounded transition-colors ${!isFutureExpense ? 'bg-red-100 font-medium' : ''}`}>Despesa Atual</span>
                <Switch
                  checked={isFutureExpense}
                  onCheckedChange={setIsFutureExpense}
                />
                <span className={`text-sm px-3 py-1 rounded transition-colors ${isFutureExpense ? 'bg-purple-100 font-medium' : ''}`}>Despesa Futura</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">Data</Label>
                <Input id="date" type="date" className="border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">Valor Total</Label>
                <Input
                  id="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="R$ 0,00"
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">Categoria</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full border-slate-200">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-[300px] overflow-y-auto">
                    <SelectGroup>
                      <SelectItem value="products">Compra de Produtos</SelectItem>
                      <SelectItem value="services">Contratação de Serviços</SelectItem>
                      <SelectItem value="suppliers">Pagamento a Fornecedores</SelectItem>
                      <SelectItem value="investments">Investimentos / Aplicações</SelectItem>
                      <SelectItem value="partners">Retirada dos Sócios</SelectItem>
                      <SelectItem value="loans">Empréstimos Concedidos</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment" className="text-sm font-medium">Forma de Pagamento</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="w-full border-slate-200">
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      <SelectItem value="pix">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          <span>Pix</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="credit">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Cartão</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="cash">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>Dinheiro</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="boleto">
                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4" />
                          <span>Boleto</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="transfer">
                        <div className="flex items-center gap-2">
                          <ArrowUpDown className="h-4 w-4" />
                          <span>Transferência</span>
                        </div>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {paymentMethod === "credit" && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="installments" className="text-sm font-medium">Parcelas</Label>
                    <Select value={installments.toString()} onValueChange={(value) => setInstallments(Number(value))}>
                      <SelectTrigger className="w-full border-slate-200">
                        <SelectValue placeholder="Número de parcelas" />
                      </SelectTrigger>
                      <SelectContent position="popper" className="max-h-[200px] overflow-y-auto">
                        <SelectItem value="1">À vista</SelectItem>
                        {[2,3,4,5,6,7,8,9,10,11,12].map((n) => (
                          <SelectItem key={n} value={n.toString()}>{n}x</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {installments > 1 && (
                    <div className="space-y-2">
                      <Label htmlFor="installmentValue" className="text-sm font-medium">Valor da Parcela</Label>
                      <Input
                        id="installmentValue"
                        value={installmentValue}
                        onChange={handleInstallmentValueChange}
                        className="border-slate-200"
                        placeholder="R$ 0,00"
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="supplier" className="text-sm font-medium">Fornecedor</Label>
                <div className="flex gap-2">
                  <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                    <SelectTrigger className="w-full border-slate-200">
                      <SelectValue placeholder="Selecione um fornecedor" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectGroup>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="shrink-0">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Novo Fornecedor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Novo Fornecedor</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-4">
                          <div>
                            <Label htmlFor="name">Nome</Label>
                            <Input
                              id="name"
                              value={newSupplier.name}
                              onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="cnpj">CNPJ</Label>
                              <Input
                                id="cnpj"
                                value={newSupplier.cnpj}
                                onChange={(e) => setNewSupplier({...newSupplier, cnpj: e.target.value})}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Telefone</Label>
                              <Input
                                id="phone"
                                value={newSupplier.phone}
                                onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="address">Endereço</Label>
                            <Input
                              id="address"
                              value={newSupplier.address}
                              onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="additionalInfo">Informações Adicionais</Label>
                            <Input
                              id="additionalInfo"
                              value={newSupplier.additionalInfo}
                              onChange={(e) => setNewSupplier({...newSupplier, additionalInfo: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleAddSupplier} className="w-full">
                          Adicionar Fornecedor
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <Button 
                onClick={handleLaunch}
                className="bg-red-500 hover:bg-red-600 h-12 px-8 text-lg"
              >
                Lançar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseDialog;
