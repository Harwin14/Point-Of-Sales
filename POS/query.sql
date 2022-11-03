
CREATE OR REPLACE FUNCTION update_penjualan() RETURNS TRIGGER AS $audit_penjualan$
    DECLARE
    stok_lama INTEGER;

    BEGIN
        IF (TG_OP = 'INSERT') THEN
            SELECT stock INTO stok_lama FROM barang WHERE kode_barang = NEW.kode_barang;
            UPDATE barang SET stok = stok_lama - NEW.qty WHERE kode_barang = NEW.kode_barang;
            --INSERT INTO audit_penjualan SELECT 'D', now(), user, OLD.*;
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO audit_penjualan SELECT 'U', now(), user, NEW.*;
        ELSIF (TG_OP = 'DELETE ') THEN
            INSERT INTO audit_penjualan SELECT 'I', now(), user, NEW.*;
        END IF;
        RETURN NULL; -- result is ignored since this is an AFTER trigger
    END;
$audit_penjualan$ LANGUAGE plpgsql;

CREATE TRIGGER audit_penjualan
AFTER INSERT OR UPDATE OR DELETE ON detail_penjualan
    FOR EACH ROW EXECUTE FUNCTION update_penjualan();