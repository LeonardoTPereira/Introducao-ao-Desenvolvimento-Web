import psycopg2
import requests

# Baixar a imagem ou usar arquivo local
url = 'https://cdn-productdbimages.barry-callebaut.com/sites/default/files/externals/f6fbbed7115ce5d3d4c2f149db496998.svg'
# Ou usar arquivo local: with open('brigadeiro.svg', 'rb') as f:

response = requests.get(url)
imagem_bytes = response.content

# Conectar ao banco
conn = psycopg2.connect(
    host="host",
    database="recipe_site",
    user="user",
    password="password"
)

cur = conn.cursor()

# Inserir a receita com a imagem
cur.execute("""
    INSERT INTO recipes (Nome, Descricao, Ingredientes, Passos, Nota, Imagem)
    VALUES (%s, %s, %s, %s, %s, %s)
""", (
    'Brigadeiro',
    'Brigadeiro gourmet com chocolate Barry Callebaut',
    [
        '1 lata de leite condensado',
        '100g de chocolate Barry Callebaut 70%',
        '1 colher de sopa de manteiga',
        'Chocolate granulado para decorar'
    ],
    [
        'Derreta o chocolate em banho-maria',
        'Em uma panela, misture o leite condensado com a manteiga',
        'Adicione o chocolate derretido e mexa bem',
        'Cozinhe em fogo baixo até desgrudar do fundo da panela',
        'Deixe esfriar e faça bolinhas',
        'Passe no chocolate granulado'
    ],
    9.5,
    psycopg2.Binary(imagem_bytes)
))

conn.commit()
cur.close()
conn.close()