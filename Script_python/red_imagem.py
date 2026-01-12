from PIL import Image
import os

#caminho_entrada = "../../website_v2/img/"
def otimizar_imagem(caminho_entrada, caminho_saida, qualidade=85):
    """
    Otimiza a imagem para reduzir o peso do arquivo mantendo a qualidade.
    :param caminho_entrada: Caminho da imagem original.
    :param caminho_saida: Caminho onde a imagem será salva.
    :param qualidade: Valor de 1 a 95 (para JPEGs).
    """
    try:
        with Image.open(caminho_entrada) as img:
            # Converte para RGB se necessário (evita erro com RGBA em JPEG)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            # Salva com otimização e remove metadados (exif)
            img.save(caminho_saida, "JPEG", optimize=True, quality=qualidade)
            
            tamanho_original = os.path.getsize(caminho_entrada) / 1024
            tamanho_final = os.path.getsize(caminho_saida) / 1024
            
            print(f"Sucesso: {caminho_entrada}")
            print(f"Tamanho Original: {tamanho_original:.2f} KB")
            print(f"Tamanho Final: {tamanho_final:.2f} KB")
            print(f"Redução de: {100 - (tamanho_final/tamanho_original*100):.1f}%")

    except Exception as e:
        print(f"Erro ao processar {caminho_entrada}: {e}")

# Exemplo de uso
#otimizar_imagem("credito.jpg", "credito_otimizado.jpg")
otimizar_imagem("mapeamento.jpg", "mapeamento_otimizado.jpg")
otimizar_imagem("topografia.jpg", "topografia_otimizada.jpg")