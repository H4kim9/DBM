import os
import pandas as pd
from io import BytesIO
from django.http import HttpResponse
from django.shortcuts import render
from .forms import CreateUserForm
import locale



def landing(request):
    return render(request, 'accounts/landing.html')

def register(request):
    form = CreateUserForm()
    return render(request, 'accounts/register.html', {'form': form})

def loginPage(request):
    return render(request, 'accounts/login.html')

def logout(request):
    return render(request, 'accounts/logout.html')

def dahsboardPage(request):
    return render(request, 'accounts/dashboard.html')

def site(request):
    return render(request, 'accounts/site.html')

def extract_filtered_data(request):
    code_site = request.GET.get("code_site", "").strip()
    sous_tables = request.GET.getlist("sous_table[]")

    file_path = os.path.join("accounts", "data", "parc-Site.xlsx")
    if not os.path.exists(file_path):
        return HttpResponse("Fichier introuvable.", status=404)

    df = pd.read_excel(file_path)
    df.columns = df.columns.map(str).str.strip()

    mappings = {
        "Codification": ("Site ID", "GSM ID", "ZI"),
        "Coordonnées Enérgitique": (
            "Électrifié/Non Électrifié", "Type", "N° contrat", "Date Contrat",
            "Fournisseur énergie", "Triph/Monoph", "Puissance souscrite", "Upgrade triphasé"
        ),
        "Données Construction": (
            "Densité (classification technique)", "Nature site", "Typologie site",
            "Typologie housing", "coloc"
        ),
        "Données Radio": (
            "Structure BTS", "Statut Site", "Fournisseur", "Puissance Optimale Radio",
            "Puissance Max Radio", "Date On air", "2G 900", "UMTS 2100", "UMTS 900 F2",
            "ON AIR L1800 F1", "LTE 800", "LTE 2600", "ON AIR TDDF1", "ON AIR TDD F2", "ON AIR L2100"
        ),
        "Données Environnement": (
            "Nbr Redresseur", "Marque redresseur", "Nbr Clim Split", "Nbr Clim Monobloc",
            "Marque Clim", "Puissance clim", "Puissance Redresseur"
        ),
        "Données Transmission": (
            "SDH", "IP/METRO", "WDM", "NGWDM (Backbone)", "Nbr Ratt FH"
        ),
        "Suivi Consommation": "Moyenne 180 jours"
    }

    if "Site ID" not in df.columns:
        return HttpResponse("La colonne 'Site ID' est absente.", status=400)

    filtered_df = df.copy() if code_site == "- Select All -" else df[df["Site ID"].astype(str).str.strip() == code_site]
    if filtered_df.empty:
        return HttpResponse("Aucun résultat pour ce code site.", status=404)

    buffer = BytesIO()
    with pd.ExcelWriter(buffer, engine='xlsxwriter', engine_kwargs={'options': {'nan_inf_to_errors': True}}) as writer:
        workbook = writer.book
        header_format = workbook.add_format({
            'bold': True,
            'bg_color': '#893873',
            'font_color': 'white',
            'align': 'center'
        })
        number_format = workbook.add_format({
            'num_format': '0.00',
            'align': 'center'
        })

        for table in sous_tables:
            if table not in mappings:
                continue

            if table == "Suivi Consommation":
                if "Moyenne 180 jours" not in df.columns:
                    continue
                start_idx = df.columns.get_loc("Moyenne 180 jours")
                selected_cols = ["Site ID"] + list(df.columns[start_idx:])
                export_df = filtered_df[selected_cols].copy()

                # Rename columns: format date headers like "janv.-25"
                new_cols = []
                for col in export_df.columns:
                    if col == "Site ID":
                        new_cols.append("Site ID")
                    else:
                        try:
                            parsed_date = pd.to_datetime(col, errors='coerce')
                            if not pd.isna(parsed_date):
                                formatted = parsed_date.strftime("%b.-%y").replace(".", "")  # "janv-25"
                                new_cols.append(formatted)
                            else:
                                new_cols.append(col)
                        except:
                            new_cols.append(col)
                export_df.columns = new_cols
            else:
                selected_cols = ["Site ID"]
                for col in mappings[table]:
                    if col in df.columns:
                        selected_cols.append(col)
                export_df = filtered_df[selected_cols].copy()

            export_df.to_excel(writer, sheet_name=table[:31], index=False)
            worksheet = writer.sheets[table[:31]]

            for col_idx, col_name in enumerate(export_df.columns):
                worksheet.set_column(col_idx, col_idx, max(15, len(str(col_name)) + 2))
                worksheet.write(0, col_idx, col_name, header_format)

            # Write values
            for row_idx in range(1, len(export_df) + 1):
                for col_idx, col_name in enumerate(export_df.columns):
                    value = export_df.iloc[row_idx - 1, col_idx]
                    if pd.isna(value) or value == "":
                        continue
                    elif isinstance(value, (int, float)):
                        worksheet.write_number(row_idx, col_idx, round(value, 2), number_format)
                    else:
                        worksheet.write(row_idx, col_idx, str(value))

    buffer.seek(0)
    return HttpResponse(
        buffer.read(),
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers={'Content-Disposition': 'attachment; filename=extracted_data.xlsx'}
    )
