# PFSense Config Exporter

### Előkövetelmények

> Node.js 18.16.0 (LTS)

### Telepités

- Repo klónozása

```
git clone https://github.com/DTbro/pfSense-config-exporter.git
```

- Modulok telepitése

```
npm install
```

- Adat könyvtárak létrehozása

```
npm run init
```

### Használat

A kiexportált pfSense konfigokat rakd be a data mappába majd futtasd a fő scriptet:

```
npm run start
```

Új funkció implementálása után először használd a Sandboxot!

1. Rakd be a test konfigot a '/sandbox/data' mappába
2. Futtasd a sandbox belépési pontot:

```
npm run sandbox
```

3. Ellenőrizd a kapott CSV-t a '/sandbox/out' mappában

### Könyvtár szerkezet

- data => exportált eredeti pfSense XML konfigok
- out => átalakitott CSV formátumú fájlok. (alkönyvtárak: aliases, fw, nat)
- sandbox => sandbox környezet könyvtárai (data: input, out: output)

#### Frissitések

- 2023.04.14: DHCP Export funkció hozzáadása
- 2023.04.16: VPN Export funkció hozzáadása, modulok kialakitása

---

_Készitette Kovács Gergely_
