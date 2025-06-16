using System.ComponentModel.DataAnnotations; // Necessário para usar Data Annotations para validação e mapeamento.
using System.Text.Json.Serialization; // Necessário para a anotação [JsonIgnore], útil para evitar ciclos de referência em serialização JSON.
using System.Collections.Generic; // Necessário para ICollection.
using Api.Models; // Importa o namespace onde a classe 'Materia' está definida, para o relacionamento.

namespace Api.Models
{
    // A classe Curso representa a entidade Curso no sistema e será mapeada para uma tabela no banco de dados.
    public class Curso
    {
        [Key] // Data Annotation que define 'Id' como a chave primária da tabela.
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome do curso é obrigatório.")] // Garante que o nome do curso seja fornecido.
        [StringLength(100, ErrorMessage = "O nome não pode ter mais de 100 caracteres.")] // Define o comprimento máximo permitido para o nome.
        public string Nome { get; set; } = string.Empty; // Nome do curso. Inicializado para evitar warnings de nulidade em C# 8+.

        // Propriedade de navegação para as matérias associadas a este curso.
        // ICollection indica um relacionamento de "um para muitos" (um Curso pode ter muitas Materias).
        // Quando um Curso é carregado do banco de dados, suas Materias associadas podem ser carregadas
        // (lazy loading ou eager loading com .Include()).
        
        // [JsonIgnore] // Esta anotação é opcional e deve ser usada com cautela.
                       // Se ativada, ela impede que a lista de matérias seja serializada quando um Curso é retornado pela API.
                       // Isso é útil para evitar ciclos de referência infinitos em payloads JSON (Ex: Curso -> Materia -> Curso...).
                       // No entanto, se o frontend precisar exibir as matérias junto com o curso,
                       // você precisaria remover esta anotação e configurar o ReferenceHandler.Preserve no Program.cs
                       // ou usar DTOs (Data Transfer Objects) para controlar a serialização.
        public ICollection<Materia>? Materias { get; set; } // A coleção é anulável para Cursos que ainda não têm matérias.
    }
}