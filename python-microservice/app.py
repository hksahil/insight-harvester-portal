from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from pbixray.core import PBIXRay
import traceback

def sizeof_fmt(num, suffix="B"):
    for unit in ("", "Ki", "Mi", "Gi", "Ti", "Pi", "Ei", "Zi"):
        if abs(num) < 1024.0:
            return f"{num:3.1f}{unit}{suffix}"
        num /= 1024.0
    return f"{num:.1f}Yi{suffix}"

app = Flask(__name__)
CORS(app)  # 👈 Allow all origins (Access-Control-Allow-Origin: *)

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.endswith(".pbix"):
        try:
            model = PBIXRay(file)

            schema_df = model.schema.copy() if model.schema is not None else pd.DataFrame()
            calculated_df = model.dax_columns.copy() if model.dax_columns is not None else pd.DataFrame()

            # Align structure
            for col in schema_df.columns:
                if col not in calculated_df.columns:
                    calculated_df[col] = None
            for col in calculated_df.columns:
                if col not in schema_df.columns:
                    schema_df[col] = None
            merged_table = pd.concat([schema_df, calculated_df], ignore_index=True)

            #Handle table data extraction
            table_data = {}
            for table in model.tables:
                try:
                    table_data[table] = model.get_table(table).to_dict(orient="records")
                except Exception as e:
                    table_data[table] = [{"error": f"Could not parse table '{table}': {str(e)}"}]

            response = {
                "metadata": model.metadata.to_dict(orient="records") if model.metadata is not None else [],
                "model_size": sizeof_fmt(model.size),
                "number_of_tables": model.tables.size,
                "columns": merged_table.to_dict(orient="records"),
                "tables": model.statistics.to_dict(orient="records") if model.statistics is not None else [],
                "relationships": model.relationships.to_dict(orient="records") if model.relationships is not None else [],
                "power_query": model.power_query.to_dict(orient="records") if model.power_query is not None else [],
                "measures": model.dax_measures.to_dict(orient="records") if model.dax_measures is not None else [],
                "table_data": table_data,
            }

            return jsonify(response), 200

        except Exception as e:
            traceback.print_exc()
            return jsonify({
                "error": "Failed to process PBIX due to server issue",
                "details": str(e)
            }), 500

    return jsonify({"error": "Invalid file type"}), 400

if __name__ == "__main__":
    app.run(debug=True)
