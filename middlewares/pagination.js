/**
 * Configurações padrão de paginação
 */
const DEFAULT_CONFIG = {
    defaultLimit: 10,
    maxLimit: 50,
    minLimit: 1,
    defaultOffset: 0,
};

/**
 * Valida e normaliza parâmetros de paginação
 * @param {Object} queryParams - Parâmetros da query string
 * @param {Object} config - Configurações de paginação
 * @returns {Object} Parâmetros validados
 */
function validatePaginationParams(queryParams, config) {
    const limit = Math.min(
        config.maxLimit,
        Math.max(config.minLimit, Number(queryParams.limit) || config.defaultLimit)
    );
    
    const offset = Math.max(0, Number(queryParams.offset) || config.defaultOffset);
    
    return { limit, offset };
}

/**
 * Calcula metadados de paginação
 * @param {number} total - Total de itens
 * @param {number} limit - Limite por página
 * @param {number} offset - Offset atual
 * @returns {Object} Metadados calculados
 */
function calculatePaginationMetadata(total, limit, offset) {
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    const hasNextPage = offset + limit < total;
    const hasPreviousPage = offset > 0;
    
    return {
        total,
        totalPages,
        currentPage,
        hasNextPage,
        hasPreviousPage,
    };
}

/**
 * Constrói URL com query parameters
 * @param {string} baseUrl - URL base
 * @param {Object} params - Parâmetros da query
 * @returns {string} URL completa
 */
function buildUrlWithParams(baseUrl, params) {
    const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Gera links de navegação (próxima e anterior)
 * @param {string} baseUrl - URL base
 * @param {Object} queryParams - Parâmetros originais da query
 * @param {Object} pagination - Dados de paginação
 * @returns {Object} Links de navegação
 */
function generateNavigationLinks(baseUrl, queryParams, pagination) {
    const { limit, offset, hasNextPage, hasPreviousPage } = pagination;
    
    // Remove limit e offset dos params originais para reconstruir
    const baseParams = { ...queryParams };
    delete baseParams.limit;
    delete baseParams.offset;
    
    const nextPage = hasNextPage
        ? buildUrlWithParams(baseUrl, {
              ...baseParams,
              limit,
              offset: offset + limit,
          })
        : null;
    
    const previousPage = hasPreviousPage
        ? buildUrlWithParams(baseUrl, {
              ...baseParams,
              limit,
              offset: Math.max(0, offset - limit),
          })
        : null;
    
    return { nextPage, previousPage };
}

/**
 * Extrai dados paginados do modelo
 * @param {Array} model - Array de dados
 * @param {number} offset - Offset inicial
 * @param {number} limit - Limite de itens
 * @returns {Array} Dados paginados
 */
function extractPaginatedData(model, offset, limit) {
    return model.slice(offset, offset + limit);
}

/**
 * Middleware de paginação modular
 * @param {Array|Function} model - Array de dados ou função que retorna os dados
 * @param {Object} options - Opções de configuração
 * @returns {Function} Middleware Express
 */
function pagination(model, options = {}) {
    const config = { ...DEFAULT_CONFIG, ...options };
    
    return (req, res, next) => {
        try {
            // 1. Validar parâmetros de paginação
            const { limit, offset } = validatePaginationParams(req.query, config);
            
            // 2. Obter dados (suporta array ou função)
            const data = typeof model === 'function' ? model(req) : model;
            
            if (!Array.isArray(data)) {
                throw new Error('Model deve ser um array ou função que retorna array');
            }
            
            // 3. Extrair dados paginados
            const result = extractPaginatedData(data, offset, limit);
            
            // 4. Calcular metadados
            const metadata = calculatePaginationMetadata(data.length, limit, offset);
            
            // 5. Construir URL base
            const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
            
            // 6. Gerar links de navegação
            const links = generateNavigationLinks(baseUrl, req.query, {
                ...metadata,
                limit,
                offset,
            });
            
            // 7. Anexar resultado ao response
            res.locals.pagination = {
                ...metadata,
                limit,
                offset,
                ...links,
                data: result,
            };
            
            next();
        } catch (error) {
            next(error);
        }
    };
}

export default pagination;
export {
    validatePaginationParams,
    calculatePaginationMetadata,
    buildUrlWithParams,
    generateNavigationLinks,
    extractPaginatedData,
    DEFAULT_CONFIG,
};