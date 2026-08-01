# Módulos de domínio

Cada feature financeira futura deve ter sua própria pasta aqui, por exemplo:

```
src/features/transactions/
  components/
  hooks/
  transactions.functions.ts
  types.ts
```

Mantenha o código de domínio isolado; compartilhe apenas o que for genérico via `src/lib` e `src/components/ui`.
