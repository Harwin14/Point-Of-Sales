
CREATE OR REPLACE FUNCTION purchases_update() RETURNS TRIGGER AS $set_purchases$
    DECLARE
    old_stock INTEGER;
    sum_price NUMERIC;

    BEGIN

        IF (TG_OP = 'INSERT') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock - NEW.quantity WHERE barcode = NEW.itemcode;
           
        ELSIF (TG_OP = 'UPDATE') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock + OLD.quantity - NEW.quantity WHERE barcode = NEW.itemcode;

        ELSIF (TG_OP = 'DELETE') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock + NEW.quantity WHERE barcode = NEW.itemcode;

        END IF;
        --update purchases
        SELECT sum(totalsum) INTO sum_price FROM purchaseitems WHERE invoice = NEW.invoice;
        UPDATE purchase SET totalsum = sum_price WHERE invoice = NEW.invoice;

        RETURN NULl; -- result is ignored this is an AFTER trigger

    END;
$set_purchases$ LANGUAGE plpgsql;

CREATE TRIGGER set_purchases
AFTER INSERT OR UPDATE OR DELETE ON purchaseitems
    FOR EACH ROW EXECUTE FUNCTION purchases_update();


    yg ini di
    

-----------------------------------------------------------remake-----------

CREATE OR REPLACE FUNCTION purchases_update() RETURNS TRIGGER AS $set_purchaseitems$
    DECLARE
    old_stock INTEGER;
    totalsum NUMERIC;

    BEGIN

        IF (TG_OP = 'INSERT') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock - NEW.quantity WHERE barcode = itemcode;
           
        ELSIF (TG_OP = 'UPDATE') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock + OLD.quantity - NEW.quantity WHERE barcode = itemcode;

        ELSIF (TG_OP = 'DELETE') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock + NEW.quantity WHERE barcode = NEW.itemcode;

        END IF;
        --update purchaseitems
        SELECT sum(purchaseprice) INTO totalsum FROM purchase WHERE invoice = NEW.invoice;
        UPDATE purchaseitems SET purchaseprice = totalsum WHERE invoice = NEW.invoice;

        RETURN NULl; -- result is ignored this is an AFTER trigger

    END;
$set_purchaseitems$ LANGUAGE plpgsql;

CREATE TRIGGER set_purchaseitems
AFTER INSERT OR UPDATE OR DELETE ON purchase
    FOR EACH ROW EXECUTE FUNCTION purchases_update();

--------------------------------------------------------------------
---------------------------------------------------------------------- 
   CREATE OR REPLACE FUNCTION purchaseitems_update() RETURNS TRIGGER AS $set_purchaseitems$
    DECLARE
    old_stock INTEGER;
    sum_prices NUMERIC;

    BEGIN

        IF (TG_OP = 'INSERT') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = itemcode;
            UPDATE goods SET stock = old_stock - NEW.quantity WHERE barcode = itemcode;
           
        ELSIF (TG_OP = 'UPDATE') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock + OLD.quantity - NEW.quantity WHERE barcode = itemcode;

        ELSIF (TG_OP = 'DELETE') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock + NEW.quantity WHERE barcode = NEW.itemcode;

        END IF;
        --update purchaseitems
        SELECT sum(purchaseprice) INTO totalsum FROM purchases WHERE invoice = NEW.invoice;
        UPDATE purchaseitems SET purchaseprice = totalsum WHERE invoice = NEW.invoice;

        RETURN NULl; -- result is ignored this is an AFTER trigger

    END;
$set_purchaseitems$ LANGUAGE plpgsql;

CREATE TRIGGER set_purchaseitems
AFTER INSERT OR UPDATE OR DELETE ON purchases
    FOR EACH ROW EXECUTE FUNCTION purchases_update(); 


    error keterangan
    ERROR:  "totalsum" is not a known variable
LINE 25:         SELECT sum(purchaseprice) INTO totalsum FROM purchas...
    ---------------------------------------------------------------
  
--update totalprice

CREATE OR REPLACE FUNCTION price_updates() RETURNS TRIGGER AS $set_total_price$
    DECLARE
        sellingprice_goods NUMERIC;
    BEGIN 
        SELECT sellingprice INTO sellingprice_goods FROM goods WHERE barcode = NEW.barcode;
        NEW.sellingprice_detail := sellingprice_goods;
        NEW.total_sellingprice_detail := NEW.quantity * sellingprice_goods;
        RETURN NEW;
   
    END;
$set_total_price$ LANGUAGE plpgsql;

CREATE TRIGGER set_total_price
BEFORE INSERT OR UPDATE ON purchaseitems
    FOR EACH ROW EXECUTE FUNCTION price_updates();


 


    -- update total harga
CREATE OR REPLACE FUNCTION update_harga() RETURNS TRIGGER AS $set_total_harga$
    DECLARE
        harga_jual_barang NUMERIC;
    BEGIN
        SELECT harga_jual_varian INTO harga_jual_barang FROM varian WHERE id_varian = NEW.id_varian;
        NEW.harga_detail_jual := harga_jual_barang;
        NEW.total_harga_detail_jual := NEW.qty * harga_jual_barang;
        RETURN NEW;
    END;
$set_total_harga$ LANGUAGE plpgsql;

CREATE TRIGGER set_total_harga
BEFORE INSERT OR UPDATE ON penjualan_detail
    FOR EACH ROW EXECUTE FUNCTION update_harga();
